import Vue from 'vue';
import VueRouter from 'vue-router';
import VueProgressBar from 'vue-progressbar';

import App from './App.vue';
import Home from './pages/Home';
import Traffic from './pages/Traffic';
import Eshop from './pages/Eshop';
import Produkt from './pages/Produkt';
import Novinky from './pages/Novinky';
import Novinka from './pages/Novinka';
import Oceneni from './pages/Oceneni';
import Uzivatele from './pages/Uzivatele';
import UzivatelHeslo from './pages/UzivatelHeslo';
import Uzivatel2FA from './pages/Uzivatel2FA';
import Uzivatel from './pages/Uzivatel';
import Databaze from './pages/Databaze';
import Hraci from './pages/Hraci';
import Hrac from './pages/Hrac';
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
  {
    path: '/eshop/produkt/pridat',
    component: Produkt,
    props: { newProdukt: true },
  },
  { path: '/eshop/produkt/:id', component: Produkt },
  { path: '/novinky', component: Novinky },
  { path: '/novinka/pridat', component: Novinka, props: { newArticle: true } },
  { path: '/novinka/:id', component: Novinka },
  { path: '/oceneni', component: Oceneni },
  { path: '/uzivatele', component: Uzivatele },
  { path: '/uzivatel/pridat', component: Uzivatel, props: { newUser: true } },
  { path: '/uzivatel/:name', component: Uzivatel },
  { path: '/uzivatel/:name/heslo', component: UzivatelHeslo },
  { path: '/uzivatel/:name/2FA', component: Uzivatel2FA },
  { path: '/databaze', component: Databaze },
  { path: '/hraci', component: Hraci },
  { path: '/hrac/pridat', component: Hrac, props: { newPlayer: true } },
  { path: '/hrac/:name', component: Hrac },
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
