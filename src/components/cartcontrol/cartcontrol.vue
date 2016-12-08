<template>
  <div class="cartcontrol">
    <transition name="move">
    <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)">
      <span class="inner icon-remove_circle_outline"></span>
    </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-increase icon-add_circle"  @click.stop.prevent="addCart($event)"></div>
  </div>
</template>

<script text="text/ecmascript-6">
  import Vue from 'vue';
  import EventHub from '../../common/js/eventHub.js';
  export default {
    data() {
      return {
      };
    },
    props: {
      food: {
        type: Object
      }
    },
    created() {
      // console.log(this.food);
    },
    methods: {
      addCart(event) {
        if (!event._constructed) {
          return;
        }
        // console.log('click');
        if (!this.food.count) {
          // 为food增加一个属性名称并设置初始值为1
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        // 分发监听给上级组件v-goods
        EventHub.$emit('cart.add', event.target);
      },
      decreaseCart(event) {
        if (!event._constructed) {
          return;
        }
        // console.log('click');
        if (this.food.count) {
          this.food.count--;
        }
        // console.log(this.food.count);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      /* 增加交互范围 */
      padding: 6px
      /* 购物车‘-’按钮动画 */
      transition: all 0.4s linear
      &.move-transition
        opacity: 1
        /* 3D模式可以开启硬件加速 使动画变得更加流畅 */
        transform: translate3d(0, 0, 0)
      .inner
        display: inline-block
        line-height: 24px
        font-size: 24px
        color: rgb(0, 160, 220)
        transition: all 0.4s linear
        transform: rotate(0)
      &.move-enter, &.move-leave-active
        opacity: 0
        transform: translate3d(24px, 0, 0)
        .inner
          transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .cart-increase
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
</style>
