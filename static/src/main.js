// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import Vant from 'vant';
import { Lazyload } from 'vant';
import 'vant/lib/index.css';
import 'vant/lib/icon/local.css'
import axios from 'axios'
import store from './store/store'

Vue.use(Vuex);
Vue.use(Vant);
Vue.use(Lazyload, {
  lazyComponent: true,
});

Vue.config.productionTip = false
Vue.prototype.$axios = axios;

router.beforeEach((to, from, next) => {
  // chrome
  document.body.scrollTop = 0
  // firefox
  document.documentElement.scrollTop = 0
  // safari
  window.pageYOffset = 0
  next()
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
