import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { store } from './store';
import vuetify from './plugins/vuetify';
import { ApiService } from './services';
import { i18n } from './i18n';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import './assets/main.scss';

// Init custom plugins
import './plugins/alert';

Vue.config.productionTip = false;
ApiService.init();

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount('#app');
