<template>
  <div class="shopcart">
    <!-- fixed 底部布局 -->
    <div class="content" @click="toggleList">
      <!-- 右侧定宽 左侧自适应 -->
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{ 'highlight': totalCount > 0 }">
            <i class="icon-shopping_cart" :class="{ 'highlight': totalCount > 0 }"></i>
          </div>
          <div class="num" v-show="totalCount > 0">{{ totalCount }}</div>
        </div>
        <div class="price" :class="{ 'highlight': totalPrice > 0 }">¥{{ totalPrice }}元</div>
        <div class="desc">另需配送费¥{{ deliveryPrice }}元</div>
      </div>
      <!-- stop 阻止组件事件冒泡传递 阻止默认事件 -->
      <div class="content-right" @click.stop.prevent="pay">
        <div class="pay" :class="payClass">
          {{ payDesc }}
        </div>
      </div>
    </div>
    <!-- 小球容器 -->
    <div class="ball-container">
      <!-- 为小球添加动画 -->
      <transition
        name="drop"
        v-for="(ball,$index) in balls"
        v-on:before-enter="beforeEnter"
        v-on:enter="enter"
        v-on:after-enter="afterEnter">
        <div class="ball" v-show="ball.show" >
          <div class="inner inner-hook"></div>
        </div>
      </transition>
    </div>
    <transition name="fold">
    <div class="shopcart-list" v-show="listShow">
      <div class="list-header">
        <h1 class="title">购物车</h1>
        <span class="empty" @click="empty">清空</span>
      </div>
      <div class="list-content" ref="listContent">
        <ul>
          <li class="food" v-for="food in selectFoods">
            <span class="name">{{ food.name }}</span>
            <div class="price">
              <span>¥{{ food.price * food.count }}</span>
            </div>
            <div class="cartcontrol-wrapper">
              <v-cartcontrol :food="food"></v-cartcontrol>
            </div>
          </li>
        </ul>
      </div>
    </div>
    </transition>
    <!-- 购物车详情的蒙层 -->
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
  </div>
</template>
<script text="text/ecmascript-6">
  // better-scroll 0.1.8 是黄轶老师重写的iScroll插件
  // https://github.com/ustbhuangyi/better-scroll
  import BScroll from 'better-scroll';
  import cartcontrol from 'components/cartcontrol/cartcontrol';

  export default {
    data() {
      return {
        balls: [
          {show: false},
          {show: false},
          {show: false},
          {show: false},
          {show: false}
        ],
        dropBalls: [],
        fold: true
      };
    },
    props: {
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      },
      selectFoods: {
        type: Array,
        default() {
          return [{
            price: 0,
            count: 0
          }];
        }
      }
    },
    computed: {
      totalPrice () {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount () {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `¥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差¥${diff}元起送`;
        } else {
          return '去结算';
        }
      },
      // 购物车为空的时候无法打开购物车详情
      listShow() {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        // 初始化better-scroll
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return show;
      },
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      }
    },
    methods: {
      // 每次使用一个小球制作飞进购物车的动画
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            // 触发动画
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      // 找到需要执行动画的小球，计算参数并执行动画
      beforeEnter(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32; /* 小球左移的偏移量 */
            let y = (window.innerHeight - rect.top - 22); /* 小球下落的偏移量 */
            /* 显示 */
            el.style.display = '';
            /* 纵向动画 */
            el.style.webkitTransform = `translate3d(0, -${y}px, 0)`;
            el.style.transform = `translate3d(0, -${y}px, 0)`;
            /* 横向动画 */
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
            inner.style.transform = `translate3d(${x}px, 0, 0)`;
          }
        }
      },
      /* 到这里动画提前结束，需要重置样式为初始状态 */
      enter(el) {
        /* eslint-disable no-unused-vars */
        let elHeight = el.offsetHeight; /* 触发浏览器重绘 */
        this.$nextTick(() => {
          // 体验优化，异步执行小球下落动画
          el.style.webkitTransform = 'translate3d(0, 0, 0)';
          el.style.transform = 'translate3d(0, 0, 0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0, 0, 0)';
          inner.style.transform = 'translate3d(0, 0, 0)';
        });
      },
      /* 最后将动画执行完毕的小球从执行队列移除，同时设为不可见 */
      afterEnter(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      // 切换购物详情的开闭状态
      toggleList() {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      empty() {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      hideList() {
        this.fold = true;
      },
      pay() {
        if (this.totalPrice < this.minPrice) {
          return;
        }
        window.alert(`需要支付${this.totalPrice}元`);
      }
    },
    components: {
      'v-cartcontrol': cartcontrol
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 2
    width: 100%
    height: 48px
    background: #141d27
    color: #fff
    .content
      display: flex
      color: rgba(255, 255, 255, .4)
      .content-left
        flex: 1
        font-size: 0
        z-index: 2
        background: #2b333b;
        .logo-wrapper
          vertical-align: top
          display: inline-block
          position: relative
          top: -10px
          margin:0 12px
          padding: 6px
          z-index: 3
          box-sizing: border-box
          width: 56px
          height: 56px
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .4)
        .price
          vertical-align: top
          display: inline-block
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, .1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700px
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index:3
        &.drop-enter-active
          /* 贝塞尔曲线 */
          transition: all .4s cubic-bezier(.49, -.29, .75, .41)
          .inner
            transition: all .4s linear
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      transform: translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition: all .5s
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, .1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float:right
          font-size: 12px
          color: rgb(0, 160, 220)
      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, .1 ))
        .name
          line-height: 24px
          font-size: 14px
          color: rgb(7, 17, 27)
        .price
          position: absolute
          right: 90px
          bottom: 12px
          line-height: 24px
          font-size: 14px
          font-weight: 700
          color: rgb(240, 20, 20)
        .cartcontrol-wrapper
          position: absolute
          right: 0px
          bottom: 6px
    .list-mask
      position: fixed
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: -2
      background: rgba(7, 17, 27, .6)
      backdrop-filter: blur(10px)  /* 只有ios才能实现的 模糊底层滤镜 */
      &.fade-enter,&.fade-leave-active
        opacity: 0 /* 透明 */
      &.fade-enter-active,&.fade-leave-active
        transition: opacity .5s
</style>
