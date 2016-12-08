<template>
  <div id="#app">
    <v-header :seller="seller"></v-header>
    <div class="tab" border-1px>
      <div class="tab-item">
        <router-link to="/goods" >商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- v-bind传值给路由视图 -->
    <!-- <keep-alive> 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。
    当组件在 <keep-alive> 内被切换，它的 activated 和 deactivated         这两个生命周期钩子函数将会被对应执行。主要用于保留组件状态或避免重新渲染。
    -->
    <keep-alive>
    <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import header from './components/header/header.vue';
  import goods from './components/goods/goods.vue';
  import ratings from './components/ratings/ratings.vue';
  import seller from './components/seller/seller.vue';
  import {urlParse} from './common/js/util.js';

  const ERR_OK = 0;

  export default {
    data() {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();
            // console.log(queryParam);
            return queryParam.id;
          })() // 立即执行函数
        }
      };
    },
    // 生命周期钩子
    created() {
      // 这里使用mock数据
      // 真实项目会根据id查询具体的对应商家的数据
      this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
        // 利用body属性转换成json对象
        response = response.body;
        // Object {errno: 0, data: Object}
        if (response.errno === ERR_OK) {
          // Object.assign() 方法可以把任意多个的源对象自身的可枚举属性拷贝给目标对象，然后返回目标对象。
          // Object.assign(target, ...sources)
          // 这里将id合并到seller里是为了给商家收藏进行本地缓存
          this.seller = Object.assign({}, this.seller, response.data);
          // Object {__ob__: Observer}
          console.log(this.seller);
        }
      });
    },
    components: {
      'v-header': header,
      'v-goods': goods,
      'v-ratings': ratings,
      'v-seller': seller
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">

/* 移动端常用经典的Flex布局
 * vue-loader的依赖库postcss可以处理浏览器兼容问题
 * 自动添加一些兼容性的代码
 * &代表父元素
 * 小技巧：使用@mediaQuery在2倍dpr设备上缩放来制作1像素边框
 */

  @import "./common/stylus/mixin.styl"

  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    // border-bottom: 1px solid rgba(7, 17, 27, 0.1)
    border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      flex: 1
      text-align: center
      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)
</style>
