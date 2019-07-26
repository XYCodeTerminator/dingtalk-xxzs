import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/AntDesignVue'
import * as dd from 'dingtalk-jsapi'
import axios from 'axios'

Vue.prototype.$http = axios
Vue.prototype.$dd = dd

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
