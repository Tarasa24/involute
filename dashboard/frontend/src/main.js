import Vue from 'vue';
import VueRouter from 'vue-router';
import VueProgressBar from 'vue-progressbar';
import Notifications from 'vue-notification';
import VueLazyload from 'vue-lazyload';

import App from './App.vue';
import Home from './pages/Home';
import Traffic from './pages/Traffic';
import Novinky from './pages/Novinky';
import Novinka from './pages/Novinka';
import Media from './pages/Media';
import Oceneni from './pages/Oceneni';
import Uzivatele from './pages/Uzivatele';
import UzivatelHeslo from './pages/UzivatelHeslo';
import Uzivatel2FA from './pages/Uzivatel2FA';
import Uzivatel from './pages/Uzivatel';
import Databaze from './pages/Databaze';
import Hraci from './pages/Hraci';
import Hrac from './pages/Hrac';
import Hry from './pages/Hry';
import Partneri from './pages/Partneri';
import Sponzori from './pages/Sponzori';
import Staff from './pages/Staff';
import StaffProfile from './pages/StaffProfile';
import Odkazy from './pages/Odkazy';
import NotFound from './pages/NotFound';

Vue.config.productionTip = false;

Vue.use(VueProgressBar, {
  color: '#A65BDA',
  failedColor: 'red',
  height: '2px',
});

Vue.use(Notifications);

Vue.use(VueLazyload, {
  loading: '/loading.svg',
});

Vue.use(VueRouter);
const routes = [
  { path: '/', component: Home },
  { path: '/traffic', component: Traffic },
  { path: '/novinky', component: Novinky },
  { path: '/novinka/pridat', component: Novinka, props: { newArticle: true } },
  { path: '/novinka/:id', component: Novinka },
  { path: '/Media/', component: Media },
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
  { path: '/hry', component: Hry },
  { path: '/partneri', component: Partneri },
  { path: '/sponzori', component: Sponzori },
  { path: '/staff', component: Staff },
  {
    path: '/staff/pridat',
    component: StaffProfile,
    props: { newStaff: true },
  },
  { path: '/staff/:name', component: StaffProfile },
  { path: '/odkazy', component: Odkazy },
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
