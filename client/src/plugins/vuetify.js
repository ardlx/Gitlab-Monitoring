import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

import VueScrollTo from 'vue-scrollto'
// [.6, .80, .30, 1.9]
Vue.use(VueScrollTo, {
  duration: 500,
  easing: [.6, .80, .30, 1.9],
  offset: 0,
  force: true,
  cancelable: true,
  onStart: false,
  onDone: false,
  onCancel: false,
  x: false,
  y: true,
  behavior: 'smooth',
  updateHistory: false
})

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
})