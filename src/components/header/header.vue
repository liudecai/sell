<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <!-- equals to ‘v-bind:src="seller.avatar"’ -->
        <img width="64" height="64" :src="seller.avatar">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{ seller.name }}</span>
        </div>
        <div class="description">
          {{ seller.description }}/{{ seller.deliveryTime }}分钟送达
        </div>
        <!-- v-if 是因为异步获取data.json的数据之前初始化的过程中supports是没有数据的 -->
        <div v-if="seller.supports" class="support">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{ seller.supports[0].description }}</span>
        </div>
      </div>
      <!-- 点击触发蒙层 -->
      <div v-if="seller.supports" class="support-count" @click="showDetails">
        <span class="count">{{ seller.supports.length }}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetails">
      <!-- 两个span紧挨着也可以消除它们之间的空白字符 -->
      <span class="bulletin-title"></span><span class="bulletin-text">{{ seller.bulletin }}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <!-- 详情蒙层 sticky footer 布局 -->
    <transition name="fade">
    <div v-show="detailsShow" class="details" >
      <div class="details-wrapper clearfix">
          <div class="details-main">
            <h1 class="name">{{ seller.name }}</h1>
            <div class="star-wrapper">
              <v-star :size="48" :score="seller.score" ></v-star>
            </div>
            <!-- 自适应flex横向布局 文字固定 横线自适应 (可以封装成独立组件)-->
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if="seller.supports" class="supports">
              <!-- (item, index)是vue2.0 写法
              vue1.0中可以直接取得$index的值-->
              <li class="support-item" v-for="(item, index) in seller.supports">
                <span class="icon" :class="classMap[ seller.supports[index].type ]"></span>
                <span class="text">{{ seller.supports[index].description }}</span>
              </li>
            </ul>
            <!-- 自适应flex横向布局 文字固定 横线自适应 (可以封装成独立组件)-->
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">{{ seller.bulletin }}</p>
            </div>
          </div>
        </div>
      <div class="details-close">
        <!-- @ 等同于 v-on: -->
        <i class="icon-close" @click="hideDetails"></i>
      </div>
    </div>
    </transition>
  </div>
</template>

<script text="text/ecmascript-6">
  import star from 'components/star/star';

  export default {
    data () {
      return {
        // default : display : none
        detailsShow: false
      };
    },
    props: {
      seller: {
        type: Object
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    methods: {
      showDetails() {
        this.detailsShow = true;
      },
      hideDetails() {
        this.detailsShow = false;
      }
    },
    components: {
      'v-star': star
    }
  };
</script>

<!-- let webstorm know it is a stylus style not wrong code -->
<style lang="stylus" rel="stylesheet/stylus">

  /* webpack的common别名只是针对js的import使用 */
  @import '../../common/stylus/mixin';

  .header
    position:relative
    color: #fff
    background: rgba(7, 17, 27, .5)
    overflow: hidden
    .content-wrapper
      position:relative
      padding: 24px 12px 18px 24px;
      /* 消除avatar和content之间由于空白字符产生的空隙 */
      font-size: 0
      .avatar
        display: inline-block
        vertical-align: top
        img
          border-radius: 2px
      .content
        display: inline-block
        margin-left: 16px
        .title
          margin: 2px 0 8px 0
          .brand
            display:inline-block
            vertical-align: top
            width: 30px
            height: 18px
            /* mixin */
            bg-image('./brand')
            background-repeat: no-repeat
            background-size: 30px 18px
          .name
            margin-left: 6px
            font-size: 16px
            line-height: 18px
            font-weight: bold
        .description
          margin-bottom: 10px
          line-height: 12px
          font-size: 12px
        .support
          .icon
            display: inline-block
            vertical-align: top
            width: 12px
            height: 12px
            margin-right: 4px
            /* 根据数据类型确定背景图片 */
            background-size:10px 10px
            background-repeat: no-repeat
            &.decrease
              bg-image('./decrease_1')
            &.discount
              bg-image('./discount_1')
            &.guarantee
              bg-image('./guarantee_1')
            &.invoice
              bg-image('./invoice_1')
            &.special
              bg-image('./special_1')
          .text
            /* chrome 字体最小只能显示12px..
            手机浏览才能看到10px的效果 */
            line-height: 12px
            font-size:10px
      .support-count
        position: absolute
        right: 12px
        bottom: 14px
        padding: 0 8px
        height: 24px
        line-height: 24px
        border-radius: 14px
        background: rgba(0, 0, 0, 0.2)
        text-align: center
        .count
          font-size: 10px
          vertical-align: top
        .icon-keyboard_arrow_right
          margin-left: 2px
          font-size: 10px
          line-height: 22px
    .bulletin-wrapper
      position: relative
      height: 28px
      line-height: 28px
      padding: 0 22px 0 12px
      /* 禁止折行 禁止溢出 溢出加点*/
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      background: rgba(7, 17, 27, 0.2)
      .bulletin-title
        display: inline-block
        vertical-align:top
        margin-top: 8px
        width: 22px
        height: 12px
        bg-image('./bulletin')
        backgound-repeat: no-repeat
        background-size: 100%
      .bulletin-text
        vertical-align:top
        margin: 0 4px
        font-size: 10px
      .icon-keyboard_arrow_right
        position: absolute
        font-size: 10px
        right: 12px
        top: 8px
    .background
      position: absolute
      top: -70%
      left: 0
      width: 100%
      z-index: -1
      filter: blur(6px)
    .details
      position: fixed
      z-index:3
      top: 0
      left: 0
      width: 100%
      height: 100%
      overflow: auto
      /* 蒙层动画 */
      background: rgba(7, 17, 27, .8)
      backdrop-filter: blur(10px) /* 只有ios才能实现的 模糊底层滤镜 */
      &.fade-enter,&.fade-leave-active
        opacity: 0
      &.fade-enter-active,&.fade-leave-active
        transition: opacity .5s
      /* CSS sticky footer 布局 的 兼容性写法
      wrapper 占满视口 而 details-close相对布局到试图之外
      然后接住负margin移动上来main空出来的位置显示
      不会让内容重叠*/
      .details-wrapper
        /* 固定缩放后100%和100vh是一样的效果了 */
        width: 100%
        min-height: 100%
        .details-main
          margin-top: 64px
          padding-bottom: 64px
          .name
            line-height: 16px
            text-align: center
            font-weight: 700px
            font-size: 16px
          .star-wrapper
            margin-top: 18px
            padding: 2px 0
            text-align: center
          .title
            display: flex
            width: 80%
            margin: 28px auto 24px auto
            .line
              flex: 1
              position: relative
              top: -6px
              border-bottom: 1px solid rgba(255, 255, 255, .2)
            .text
              padding: 0 12px
              font-weight: 700
              font-size: 14px
          .supports
            width: 80%
            margin: 0 auto
            .support-item
              padding: 0 12px
              margin-bottom: 12px
              font-size: 0
              &:last-child
                margin-bottom: 0
              .icon
                display: inline-block
                width: 16px
                height: 16px
                vertical-align: top
                margin-right: 6px
                background-size: 16px 16px
                background-repeat: no-repeat
                &.decrease
                  bg-image('decrease_2')
                &.discount
                  bg-image('discount_2')
                &.guarantee
                  bg-image('guarantee_2')
                &.invoice
                  bg-image('invoice_2')
                &.special
                  bg-image('special_2')
              .text
                line-height: 16px
                font-size: 12px
          .bulletin
            width: 80%
            margin: 0 auto
            .content
              padding: 0 12px
              line-height: 24px
              font-size: 12px
      .details-close
        position: relative
        width: 32px
        height: 32px
        margin: -64px auto 0 auto
        clear: both
        font-size: 32px


</style>
