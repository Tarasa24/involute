import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App.vue';
import Home from './pages/Home';
import Traffic from './pages/Traffic';
import NotFound from './pages/NotFound';

Vue.config.productionTip = false;

Vue.use(VueRouter);
const routes = [
  { path: '/', component: Home },
  { path: '/traffic', component: Traffic },
  { path: '/*', component: NotFound },
];
const router = new VueRouter({
  base: '/dashboard/',
  routes,
  mode: 'history',
});

new Vue({
  render: h => h(App),
  router,
}).$mount('#app');
