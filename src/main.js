import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from './components/goods/goods.vue';
import ratings from './components/ratings/ratings.vue';
import seller from './components/seller/seller.vue';

// common的别名在 webpack.base.conf.js中设置
import 'common/stylus/index.styl';

// Add plugin of Vue Router
Vue.use(VueRouter);
// Add plugin of Vue Resource
Vue.use(VueResource);

const routes = [
  { path: '/goods', component: goods },
  { path: '/ratings', component: ratings },
  { path: '/seller', component: seller }
];
const router = new VueRouter({
  routes,
  // 指定router-link获得匹配链接时显示的class名称
  linkActiveClass: 'active'
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

// router.push('/goods');
