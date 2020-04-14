import Vue from 'vue';
import VueRouter from 'vue-router';
import Vue2TouchEvents from 'vue2-touch-events';
import VueProgressBar from 'vue-progressbar';
import ZoomOnHover from 'vue-zoom-on-hover';

import App from './App.vue';
import Home from './pages/Home';
import Novinky from './pages/Novinky';
import Novinka from './pages/Novinka';
import Hraci from './pages/Hraci';
import Hrac from './pages/Hrac';
import Partneri from './pages/Partneri';
import Oceneni from './pages/Oceneni';
import Eshop from './pages/Eshop';
import Produkt from './pages/Produkt';
import Kosik from './pages/Kosik';
import Platba from './pages/Platba';
import Objednavka from './pages/Objednavka';
import Kontakt from './pages/Kontakt';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

Vue.use(VueRouter);
Vue.use(Vue2TouchEvents);
Vue.use(VueProgressBar, {
  color: '#A65BDA',
  failedColor: 'red',
  height: '2px',
});
Vue.use(ZoomOnHover);

const routes = [
  { path: '/', component: Home },
  {
    path: '/novinky/:page?',
    component: Novinky,
    props: route => ({ page: route.params.page || 1 }),
  },
  { path: '/novinka/:id', component: Novinka },
  { path: '/hraci', component: Hraci },
  { path: '/hrac/:game/:name', component: Hrac },
  { path: '/partneri', component: Partneri },
  { path: '/oceneni', component: Oceneni },
  { path: '/eshop', component: Eshop },
  { path: '/eshop/produkt/:id', component: Produkt },
  { path: '/eshop/kosik', component: Kosik },
  { path: '/eshop/platba', component: Platba },
  { path: '/eshop/objednavka/:type', component: Objednavka },
  { path: '/kontakt', component: Kontakt },
  { path: '/login', component: Login },
  { path: '*', component: NotFound },
];

const router = new VueRouter({
  routes,
  mode: 'history',
});

new Vue({
  render: h => h(App),
  router,
}).$mount('#app');
