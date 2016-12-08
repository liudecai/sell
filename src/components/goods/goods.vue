<template>
<!-- 商品页 -->
<div class="goods">
  <div class="menu-wrapper" ref="menuWrapper">
    <ul>
      <li v-for="(item, $index) in goods" class="menu-item" :class="{'current':currentIndex === $index}" @click="selectMenu($index, $event)">
        <span class="text" border-1px>
          <!-- 这个span 也可以抽象出来一个组件使用 -->
          <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{ item.name }}
        </span>
      </li>
    </ul>
  </div>
  <div class="foods-wrapper" ref="foodsWrapper">
    <ul>
      <!-- 商品类别 food-list-hook 供JS调用DOM元素 -->
      <li v-for="item in goods" class="food-list food-list-hook">
        <h1 class="title">{{ item.name }}</h1>
        <ul>
          <!-- 商品列表 -->
          <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
            <div class="icon">
              <img :src="food.icon" width="57" height="57">
            </div>
            <div class="content">
              <h2 class="name">{{ food.name }}</h2>
              <p class="desc">{{ food.description }}</p>
              <div class="extra">
                <!-- span紧挨着 避免空白字符bug -->
                <span class="count">月售{{ food.sellCount }}份</span><span>好评率{{ food.rating }}</span>
              </div>
              <div class="price">
                <span class="now">¥{{ food.price }}</span>
                <span class="old" v-show="food.oldPrice">¥{{ food.oldPrice }}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <v-cartcontrol :food="food"></v-cartcontrol>
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <v-shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price ="seller.minPrice"></v-shopcart>
  <v-food :food="selectedFood" ref="food"></v-food>
</div>
</template>

<script text="text/ecmascript-6">
  // better-scroll 0.1.8 是黄轶老师重写的iScroll插件
  // https://github.com/ustbhuangyi/better-scroll
  import BScroll from 'better-scroll';
  import shopcart from 'components/shopcart/shopcart';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import food from 'components/food/food';
  import EventHub from '../../common/js/eventHub.js';
  const ERR_OK = 0;
  export default {
    data () {
      return {
        goods: [],
        listHeights: [],
        fScrollY: 0, /* 跟踪商品列表的Y坐标 */
        mScrollY: 0, /* 跟踪菜单列表的Y坐标 */
        selectedFood: {}
      };
    },
    methods: {
      /* 初始化BetterScroll */
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          probeType: 3,
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          probeType: 3, /* 实时获取滚动位置 */
          click: true
        });
        /* 解决左侧高亮菜单超出可视范围的问题 */
        this.foodsScroll.on('scroll', (pos) => {
          this.fScrollY = Math.abs(Math.round(pos.y));

          if (this.currentIndex) {
            // let viewPortHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            // let headerH = document.getElementsByClassName('header')[0].clientHeight;
            // let tabH = document.getElementsByClassName('tab')[0].clientHeight;
            // const shopCartH = 61; // px
            let menuH = document.getElementsByClassName('current')[0].clientHeight;
            let menusH = menuH * this.currentIndex;
            this.menuScroll.scrollTo(0, -menusH + menuH);
          }
        });
      },
      _fCalculateHeight() {
        // 获取每个foodList的li的y轴高度
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeights.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeights.push(height);
        }
        // console.log(this.listHeights);
      },
      selectMenu (index, event) {
        /*
        当设置click:true的时候会派发点击事件，而PC端浏览器也会派发原生的点击事件
        这样会导致PC端点击一次图标出现两次点击事件发生的事情
        避免方法:
        由于better-scroll的click为true时派发的点击事件存在_constructed属性
        当不存在这个属性时候也就是判断为浏览器原生点击事件的时候取消better-scroll的事件派发即可
        */
        if (undefined === event._constructed) {
          console.log('PC' + index + ' ' + event);
          return;
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 300);
        // console.log('MB' + index);
      },
      // 将DOM传递给子组件处理
      _drop(target) {
        // 通过ref访问子组件的方法
        this.$refs.shopcart.drop(target);
      },
      selectFood (food, event) {
        if (!event._constructed) {
          return;
        }
        // console.log(food.name);
        this.selectedFood = food;
        this.$refs.food.show();
      }
    },
    props: {
      seller: {
        type: Object,
        default: {}
      }
    },
    created() {
      // 监听子组件的cart.add事件，获取dom
      EventHub.$on('cart.add', el => {
        // 体验优化，异步执行下落动画
        this.$nextTick(() => {
          this._drop(el);
        });
      });
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      // 这里ajax依赖于vue-resource插件，目前官方推荐使用axios插件执行ajax了
      this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          // 为了能正确获取DOM元素的属性 更新DOM后才执行初始化为
          this.$nextTick(() => {
            this._initScroll();
            this._fCalculateHeight();
          });
          // console.log(this.goods);
        } else {
          console.log('请求不到数据');
        }
      });
    },
    computed: {
      currentIndex () {
        for (let i = 0; i < this.listHeights.length; i++) {
          let height1 = this.listHeights[i];
          let height2 = this.listHeights[i + 1];
          /* 获取滚动区间 */
          if (!height2 || (this.fScrollY >= height1 && this.fScrollY < height2)) {
            return i;
          }
        }
      },
      selectFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    components: {
      'v-shopcart': shopcart,
      'v-cartcontrol': cartcontrol,
      'v-food': food
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    /* 左侧定宽 */
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        /* table布局 便于 多行垂直居中 */
        display: table
        height: 54px
        /* 左右居中 */
        padding:0 12px
        line-height: 14px
        /* 当前列表进行高亮 */
        &.current
          position: relative
          /* 覆盖上面的细线 */
          margin-top: -1px
          z-index: 1
          background: #fff
          font-weight: 700
          .text
            border-1px-none()
        /* icon 也可以单独抽象成一个组件 */
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          /* 根据数据类型确定背景图片 */
          background-size:10px 10px
          background-repeat: no-repeat
          &.decrease
            bg-image('./decrease_3')
          &.discount
            bg-image('./discount_3')
          &.guarantee
            bg-image('./guarantee_3')
          &.invoice
            bg-image('./invoice_3')
          &.special
            bg-image('./special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          font-size: 12px
          border-1px(rgba(7, 17, 27, .1))
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, .1))
        &:last-child
          border-1px-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin:2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc,.extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153 ,159)
          .desc
            margin-bottom: 8px
            line-height: 12px
          .extra
            .count
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
            right: 0
            bottom: 12px
</style>
