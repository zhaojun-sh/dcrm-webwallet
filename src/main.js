// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import {
  Button,
  Collapse,
  CollapseItem,
  Dialog,
  Icon,
  Message,
  Tooltip,
  Radio,
  RadioGroup,
  Form,
  FormItem,
  Input,
  Row,
  Col,
  Table,
  TableColumn,
  Popover,
  Loading,
  Switch,
  Select,
  Option
} from 'element-ui'

import Vuex from 'vuex'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store/store'

import $$ from './assets/js/methods'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/css.css'
import './assets/css/style.css'
import FastClick from 'fastclick'

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body)
  }, false)
}
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'

Vue.use('axios')

Vue.use(Button)
Vue.use(Dialog)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Icon)
Vue.component(Message.name, Message)
Vue.use(Tooltip)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Popover)
Vue.use(Loading)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)

Vue.use(Vuex)

Vue.config.productionTip = false

let setLanguage = (lang) => {
  let langData
  if (lang === 'en') {
    langData = langEn
  } else if (lang === 'zh') {
    langData = langZh
  } else {
    langData = langEn
  }
  Vue.prototype.LANG = langData
}

let languageType = localStorage.getItem('WALLET_LANGUAGE_TYPE')
let langZh = require('@/assets/js/language/zh')
let langEn = require('@/assets/js/language/en')
setLanguage(languageType)

Vue.prototype.$$ = $$
Vue.prototype.$http = axios
Vue.prototype.$message = Message
Vue.prototype.changeLang = (lang) => {
  setLanguage(lang)
}

window.$ajax = axios
window.Qs = require('qs')
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
