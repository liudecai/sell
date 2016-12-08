<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{ seller.name }}</h1>
        <div class="desc border-1px">
          <v-star :size="36" :score="seller.score"></v-star>
          <span class="text">({{ seller.ratingCount }})</span>
          <span class="text">月售{{ seller.sellCount }}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{ seller.minPrice }}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{ seller.deliveryPrice }}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{ seller.deliveryTime }}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite($event)">
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="text">{{ favoriteText }}</span>
        </div>
      </div>
      <v-split></v-split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{ seller.bulletin }}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <!-- (item, index)是vue2.0 写法
          vue1.0中可以直接取得$index的值-->
          <li class="support-item border-1px" v-for="(item, index) in seller.supports">
            <span class="icon" :class="classMap[ seller.supports[index].type ]"></span>
            <span class="text">{{ seller.supports[index].description }}</span>
          </li>
        </ul>
      </div>
      <v-split></v-split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="pic in seller.pics">
              <img width="120" height="90" :src="pic">
            </li>
          </ul>
        </div>
      </div>
      <v-split></v-split>
      <div class="info">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li class="info-item border-1px" v-for="info in seller.infos">{{ info }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script text="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import star from 'components/star/star';
  import split from 'components/split/split';
  import {saveToLocal, loadFromLocal} from '../../common/js/store.js';

  export default {
    data () {
      return {
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false);
        })()
      };
    },
    computed: {
      favoriteText() {
        return this.favorite ? '已收藏' : '收藏';
      }
    },
    methods: {
      _initScroll() {
        if (!this.scroll) { // 首次需要初始化
          this.scroll = new BScroll(this.$refs.seller, {
            click: true
          });
        } else { // 如果不是首次 则重新计算滚动数据
          this.scroll.refresh();
        }
      },
      _initPic() {
        // 商家实景图片横向BScroll滚动
        if (this.seller.pics) {
          let picWidth = 120;
          let margin = 6;
          let width = (picWidth + margin) * this.seller.pics.length - margin;
          // 计算滚动的宽度
          this.$refs.picList.style.width = width + 'px';
          if (!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picWrapper, {
              scrollX: true, // 横滚
              eventPassthrough: 'vertical' // 横滚时忽略纵滚
            });
          } else {
            this.picScroll.refresh();
          }
        }
      },
      toggleFavorite(event) {
        if (!event._constructed) {
          return;
        }
        this.favorite = !this.favorite;
        // 本地存储方案
        // {"12345":{"favorite":true}}
        saveToLocal(this.seller.id, 'favorite', this.favorite);
        console.log(loadFromLocal(this.seller.id, 'favorite', false));
      }
    },
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      'v-star': star,
      'v-split': split
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    // 当DOM渲染完成后初始化BScroll 比如切换标签页导致的DOM渲染
    // vue2.0使用新的 mounted 钩子代替 ready
    // 通过使用 mounted 钩子，并不能保证该实例已经插入文档
    // 所以还应该在钩子函数中包含 Vue.nextTick/vm.$nextTick
    mounted() {
      this.$nextTick(() => {
        // console.log('on mounted hook ' + this.$refs.seller);
        this._initScroll();
        this._initPic();
      });
    },
    // 监听属性值的变化
    watch: {
      'seller'() {
        // 当页面第一次打开seller异步获取数据之前为null,当获取数据后watch到变化触发
        // 需要等DOM重新渲染完毕再初始化BScroll滚动
        this.$nextTick(() => {
          // 498px
          // console.log('on watch seller ' + this.$refs.seller);
          this._initScroll();
        });
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  .seller
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    height: 100hv // 不加也是一样的
    overflow: hidden
    .overview
      position: relative
      padding: 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 14px
      .desc
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, .1))
        font-size: 0
        .star
          display: inline-block
          margin-right: 8px
          vertical-align: top
        .text
          display: inline-block
          vertial-align: top
          margin-right: 12px
          line-height: 18px
          font-size: 10px
      .remark
        display: flex
        padding-top: 18px
        .block
          flex: 1
          text-align: center
          // 可以媒体查询做成1像素边框
          border-right: 1px solid rgba(7, 17, 27, .1)
          &:last-child
            border-right: none
          h2
            margin-bottom: 4px
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .content
            line-height: 24px
            font-size:  10px
            color: rgb(7, 17, 27)
            .stress
              font-size: 24px
      .favorite
        position: absolute
        top: 18px
        right: 11px
        width: 50px
        text-align: center
        .icon-favorite
          display: block
          margin-bottom: 4px
          line-height: 24px
          font-size: 24px
          color: #d4d6d9
          &.active
            color: rgb(240, 20, 20)
        .text
          line-height: 10px
          color: rgb(77, 85, 93)
    .bulletin
      padding: 18px 18px 0 18px;
      .title
        margin-bottom: 8px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 14px
      .content-wrapper
        padding: 0 12px 16px 12px;
        border-1px(rgba(7, 17, 27, .1))
        .content
          line-height: 24px
          font-size: 12px
          color: rgb(240, 20, 20)
      .supports
        .support-item
          padding: 16px 12px
          border-1px(rgba(7, 17, 27, .1))
          font-size: 0
          &:last-child
            border-1px-none()
          .icon
            display: inline-block
            vertical-align: top
            width: 16px
            height: 16px
            margin-right: 6px
            /* 根据数据类型确定背景图片 */
            background-size:16px 16px
            background-repeat: no-repeat
            &.decrease
              bg-image('./decrease_4')
            &.discount
              bg-image('./discount_4')
            &.guarantee
              bg-image('./guarantee_4')
            &.invoice
              bg-image('./invoice_4')
            &.special
              bg-image('./special_4')
          .text
            /* chrome 字体最小只能显示12px..
            手机浏览才能看到10px的效果 */
            line-height: 16px
            font-size:12px
            color: rgb(7, 17, 27)
    .pics
      padding: 18px
      .title
        margin-bottom: 12px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 14px
      .pic-wrapper
        width: 100%
        overflow: hidden
        white-space: nowrap /* 不折行 */
        .pic-list
          font-size: 0
          .pic-item
            display: inline-block
            margin-right: 6px
            width: 120px
            height: 90px
            &:last-child
              margin-right: 0
    .info
      padding: 18px 18px 0 18px
      color: rgb(7, 17, 27)
      .title
        padding-bottom: 12px
        line-height: 14px
        border-1px(rgba(7, 17, 27, .1))
        font-size: 14px
      .info-item
        padding: 16px 12px
        line-height: 16px
        font-size: 12px
        border-1px(rgba(7, 17, 27, .1))
        &:last-child
          border-1px-none()
</style>
