// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import App from './App'
// import App from '@/components/web/page/index'
import router from './router'
import store from './store/store'

// import $ from 'jquery'
import $$ from './assets/js/methods'
import web3 from './assets/js/lilo'
// import './assets/css/bootstrap.min.css'
import './assets/css/css.css'
import './assets/css/style.css'
// import '../node_modules/bootstrap/dist/js/bootstrap.min.js'
// import './assets/js/bootstrap.js'
// import 'https://cdn.staticfile.org/twitter-bootstrap/4.1.0/css/bootstrap.min.css'
// import 'https://cdn.staticfile.org/popper.js/1.12.5/umd/popper.min.js'
// import 'https://cdn.staticfile.org/twitter-bootstrap/4.1.0/js/bootstrap.min.js'
// import './assets/js/web3.min.js'
import FastClick from 'fastclick'

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body)
  }, false)
}
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
  web3,
  // $,
  store,
  components: { App },
  template: '<App/>'
})
