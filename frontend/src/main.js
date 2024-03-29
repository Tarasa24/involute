import Vue from 'vue';
import VueRouter from 'vue-router';
import VueProgressBar from 'vue-progressbar';
import AsyncComputed from 'vue-async-computed';
import VueLazyload from 'vue-lazyload';

import App from './App.vue';
import Home from './pages/Home';
import Novinky from './pages/Novinky';
import Novinka from './pages/Novinka';
import Hraci from './pages/Hraci';
import Hrac from './pages/Hrac';
import Staff from './pages/Staff';
import StaffProfile from './pages/StaffProfile';
import Partneri from './pages/Organizace/Partneri';
import Oceneni from './pages/Oceneni';
import Media from './pages/Media';
import About from './pages/Organizace/About';
import Kontakt from './pages/Organizace/Kontakt';
import Branding from './pages/Organizace/Branding';
import Cookies from './pages/Cookies';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

Vue.use(VueRouter);
Vue.use(VueProgressBar, {
  color: '#A65BDA',
  failedColor: 'red',
  height: '2px',
});
Vue.use(AsyncComputed);
Vue.use(VueLazyload, {
  loading: require('./assets/img/loading.svg'),
});

const routes = [
  { path: '/', component: Home, meta: { title: 'Home' } },
  {
    path: '/novinky/:page?',
    component: Novinky,
    props: { perPage: 12 },
    meta: { title: 'Novinky' },
  },
  { path: '/novinka/:id', component: Novinka },
  { path: '/hraci', component: Hraci, meta: { title: 'Hráči' } },
  { path: '/hrac/:name', component: Hrac },
  { path: '/staff', component: Staff, meta: { title: 'Staff' } },
  { path: '/staff/:name', component: StaffProfile },
  { path: '/oceneni', component: Oceneni, meta: { title: 'Ocenění' } },
  {
    path: '/media/:page?',
    component: Media,
    props: { perPage: 12 },
    meta: { title: 'Media' },
  },
  { path: '/about', component: About, meta: { title: 'O nás' } },
  { path: '/partneri', component: Partneri, meta: { title: 'Partneři' } },
  { path: '/kontakt', component: Kontakt, meta: { title: 'Kontakt' } },
  { path: '/branding', component: Branding, meta: { title: 'Branding' } },
  { path: '/cookies', component: Cookies, meta: { title: 'Cookies' } },
  { path: '/login', component: Login, meta: { title: 'Login' } },
  { path: '*', component: NotFound, meta: { title: '404' } },
];

const router = new VueRouter({
  routes,
  mode: 'history',
});

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  if (to.meta.title) document.title = `iNvolute | ${to.meta.title}`;
  next();
});

new Vue({
  render: h => h(App),
  router,
}).$mount('#app');
