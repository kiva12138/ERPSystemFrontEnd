import Vue from 'vue'
import App from './App'
import router from './router/router_new.js'
import ElementUI from 'element-ui'
import VueSession from 'vue-session'
import VueCookies from 'vue-cookies'
import VueResource from 'vue-resource'
import 'element-ui/lib/theme-chalk/index.css'

import global from './config/global.vue'

Vue.use(ElementUI)
Vue.use(VueSession)
Vue.use(VueCookies)
Vue.use(VueResource)

Vue.config.productionTip = false
Vue.prototype.GLOBAL = global

let app = new Vue(
  {
    el: '#app',
    router,
    components: {
      'App': App
    },
    template: '<App/>'
  }
)

Vue.use(app)
