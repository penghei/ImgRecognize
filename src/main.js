import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'

import VueWorker from 'vue-worker'


Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueWorker);

new Vue({
  render: h => h(App),
  beforeCreate(){
    Vue.prototype.bus = this;
  }
}).$mount('#app')
