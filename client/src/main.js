import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import JsonExcel from 'vue-json-excel'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import myPlugins from './plugins/myplugins';

Vue.config.productionTip = false
Vue.component('downloadExcel', JsonExcel)
Vue.use(Antd);
Vue.use(myPlugins);


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
