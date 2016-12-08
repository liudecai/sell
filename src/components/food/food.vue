<template>
  <transition name="slide">
  <div class="food" ref="foodWrapper" v-show="showFlag">
    <div class="container">
      <div class="image-header">
        <img :src="food.image">
        <div class="back" @click="hide">
          <i class="icon-arrow_lift"></i>
        </div>
      </div>
      <div class="content">
        <h1 class="title">{{ food.name }}</h1>
        <div class="details">
          <span class="sell-count">月售{{ food.sellCount }}份</span>
          <span class="rating">好评率{{ food.rating }}%</span>
        </div>
        <!-- price 也可以考虑抽象成组件 -->
        <div class="price">
          <span class="now">¥{{ food.price }}</span><span class="old" v-show="food.oldPrice">¥{{ food.oldPrice }}</span>
        </div>
        <div class="cartcontrol-wrapper">
          <v-cartcontrol :food="food"></v-cartcontrol>
        </div>
        <transition name="fade">
          <div @click.stop.prevent="addFirst($event)" class="buy" v-show="!food.count || food.count===0">加入购物车</div>
        </transition>
      </div>
      <v-split v-show="food.info"/>
      <div class="info" v-show="food.info">
        <h1 class="title">商品信息</h1>
        <p class="text">{{ food.info }}</p>
      </div>
      <v-split/>
      <div class="rating">
        <h1 class="title">商品评价</h1>
        <v-ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></v-ratingselect>
        <div class="rating-wrapper">
          <ul v-show="food.ratings && food.ratings.length">
            <li v-show="needShow(rating.rateType, rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
              <div class="user">
                <span class="name">{{ rating.username }}</span>
                <img class="avatar" width="12" height="12" :src="rating.avatar">
              </div>
              <!-- Vue过滤器 filters 缩写为 | -->
              <div class="time">{{ rating.rateTime | formatDate }}</div>
              <p class="text">
                <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{ rating.text }}
              </p>
            </li>
          </ul>
          <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
        </div>
      </div>
    </div>
  </div>
  </transition>
</template>

<script text="text/ecmascript-6">
  import Vue from 'vue';
  import EventHub from '../../common/js/eventHub.js';
  import BScroll from 'better-scroll';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import split from 'components/split/split';
  import ratingselect from 'components/ratingselect/ratingselect';
  // export function formatDate（time， formatString）
  import {formatDate} from '../../common/js/date.js';

  /* eslint-disable no-unused-vars */
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default {
    data () {
      return {
        // 商品详情显示开关
        showFlag: false,
        // 商品详情初始化
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',      // 2
          positive: '推荐', // 0
          negative: '吐槽'  // 1
        }
      };
    },
    props: {
      food: {
        type: Object,
        default: {}
      }
    },
    methods: {
      // 父组件可以直接调用子组件的入口方法
      show() {
        // 控制商品详情显示
        this.showFlag = true;

        this.$nextTick(() => {
        // 避免多次show
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.foodWrapper, {
              click: true
            });
          } else {
            // 重新计算滚动
            this.scroll.refresh();
          }
          // console.log(this.scroll);
        });
      },
      hide() {
        this.showFlag = false;
      },
      addFirst(event) {
        if (!event._constructed) {
          return;
        }
        // 分发监听给上级组件v-goods
        EventHub.$emit('cart.add', event.target);
        // 第一次添加购物车时需要添加count属性并初始化为1
        Vue.set(this.food, 'count', 1);
      },
      // 过滤评论信息
      needShow (type, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      'v-cartcontrol': cartcontrol,
      'v-split': split,
      'v-ratingselect': ratingselect
    },
    updated() {
      // 获取子组件的selectType的更新
      EventHub.$on('ratingtype.select', selectType => {
        this.selectType = selectType;
        // 更改评价显示设置后更新DOM然后重新计算滚动
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      });
      EventHub.$on('content.toggle', onlyContent => {
        this.onlyContent = onlyContent;
        // 更改内容显示设置后更新DOM然后重新计算滚动
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      });
      // console.log(this.selectType + ' ' + this.onlyContent);
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 1
    width: 100%
    background: #fff
    /* slide show animation */
    transform: translate3d(0, 0, 0)
    &.slide-enter, &.slide-leave-active
      transform: translate3d(100%, 0, 0)
      /*opacity: .5*/
    &.slide-enter-active, &.slide-leave-active
      transition: all .8s
    .image-header
      position:relative
      width: 100%
      /* #####################################
      ## padding为100%时按照盒子模型宽度计算高度 ##
      ######################################*/
      height: 0
      padding-top: 100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: 20px
          color: #fff
    .content
      position: relative
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .details
        margin-bottom: 18px
        line-height: 10px
        height: 10px
        font-size: 0
        .sell-count, .rating
          font-size: 10px
          color: rgb(147, 153, 159)
        .sell-count
          margin-right: 12px
      .price
        font-weight: 700
        line-height: 24px
        .now
          margin-right: 18px
          font-size: 14px
          color: rgb(240, 20, 20)
        .old
          text-decoration: line-through
          font-size: 10px
          color: rgb(147, 153, 79)
      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index:2
        height: 24px
        line-height: 24px
        padding: 0 12px
        border-radius: 12px
        box-sizing: border-box
        font-size: 10px
        color: #fff
        background: rgb(0, 160, 220)
        /* fade show animation
        这个动画可以避免dom的改变和下一个小球动画同时发生
        好在此处不加这个动画也是没有问题的
        */
        &.fade-enter, &.fade-leave-active
          opacity: 0
        &.fade-enter-active, &.fade-leave-active
          transition: all .2s
    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        color: rgb(7, 17, 27)
      .text
        line-height: 24px
        padding: 0 8px
        font-size: 12px
        color: rgb(77, 85, 93)
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        color: rgb(7, 17, 27)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7, 17, 27, .1))
          .user
            position: absolute
            right: 0
            top: 16px
            line-height: 12px
            font-size: 0px
            .name
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size: 10px
              color: rgb(147, 153, 159)
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7, 17, 27)
          .icon-thumb_up, .icon-thumb_down
            margin-right: 4px
            line-height: 16px
            font-size: 12px
          .icon-thumb_up
            color:rgb(0, 160, 220)
          .icon-thumb_down
            color:rgb(147, 153, 159)
        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147, 153, 159)
</style>
