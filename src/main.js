import Vue from "vue";
import App from "./App.vue";
import router from "./router/router";
import store from "./store/store";


import "vant/lib/index.css";
import Vant, { Lazyload } from 'vant'
Vue.use(Lazyload)
Vue.use(Vant);
Vue.config.productionTip = false;
Vue.prototype.$sleep = time => {
  return new Promise(resolve => {
    window.setTimeout(resolve, time);
  });
};
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
