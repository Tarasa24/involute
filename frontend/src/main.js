import Vue from 'vue';
import VueRouter from 'vue-router';
import Vue2TouchEvents from 'vue2-touch-events';
import VueProgressBar from 'vue-progressbar';
import AsyncComputed from 'vue-async-computed';
import VueLazyload from 'vue-lazyload';

import App from './App.vue';
import Home from './pages/Home';
import Novinky from './pages/Novinky';
import Novinka from './pages/Novinka';
import Hraci from './pages/Hraci';
import Hrac from './pages/Hrac';
import Partneri from './pages/Organizace/Partneri';
import Oceneni from './pages/Oceneni';
import Media from './pages/Media';
import Kontakt from './pages/Organizace/Kontakt';
import Branding from './pages/Organizace/Branding';
import Cookies from './pages/Cookies';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

Vue.use(VueRouter);
Vue.use(Vue2TouchEvents);
Vue.use(VueProgressBar, {
  color: '#A65BDA',
  failedColor: 'red',
  height: '2px',
});
Vue.use(AsyncComputed);
Vue.use(VueLazyload, {
  loading: '/loading.svg',
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
  { path: '/oceneni', component: Oceneni, meta: { title: 'Ocenění' } },
  {
    path: '/media/:page?',
    component: Media,
    props: { perPage: 12 },
    meta: { title: 'Média' },
  },
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
