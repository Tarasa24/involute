import Vue from 'vue';
import VueRouter from 'vue-router';
import VueProgressBar from 'vue-progressbar';

import App from './App.vue';
import Home from './pages/Home';
import Traffic from './pages/Traffic';
import Eshop from './pages/Eshop';
import Produkt from './pages/Produkt';
import Novinky from './pages/Novinky';
import Soubory from './pages/Soubory';
import NotFound from './pages/NotFound';

Vue.config.productionTip = false;

Vue.use(VueProgressBar, {
  color: '#A65BDA',
  failedColor: 'red',
  height: '2px',
});

Vue.use(VueRouter);
const routes = [
  { path: '/', component: Home },
  { path: '/traffic', component: Traffic },
  { path: '/eshop', component: Eshop },
  { path: '/eshop/produkt/:id', component: Produkt },
  { path: '/novinky', component: Novinky },
  { path: '/soubory', component: Soubory },
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
