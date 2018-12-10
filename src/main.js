// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store/store'

import $ from 'jquery'
import $$ from './assets/js/methods'

import './assets/css/bootstrap.min.css'
import './assets/css/css.css'
import './assets/css/style.css'
// import '../node_modules/bootstrap/dist/js/bootstrap.min.js'
import './assets/js/bootstrap.js'
// import './assets/js/web3.min.js'

Vue.use('axios')
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
Vue.config.productionTip = false
Vue.prototype.$$ = $$
Vue.prototype.$http = axios
Vue.use(Vuex)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  $,
  store,
  components: { App },
  template: '<App/>'
})
