import Vue from 'vue';
import VueRouter from 'vue-router';
import Vue2TouchEvents from 'vue2-touch-events';
import VueProgressBar from 'vue-progressbar';
import AsyncComputed from 'vue-async-computed';

import App from './App.vue';
import Home from './pages/Home';
import Novinky from './pages/Novinky';
import Novinka from './pages/Novinka';
import Hraci from './pages/Hraci';
import Hrac from './pages/Hrac';
import Partneri from './pages/Partneri';
import Oceneni from './pages/Oceneni';
import Media from './pages/Media';
import Kontakt from './pages/Kontakt';
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

const routes = [
  { path: '/', component: Home },
  {
    path: '/novinky/:page?',
    component: Novinky,
    props: { perPage: 12 },
  },
  { path: '/novinka/:id', component: Novinka },
  { path: '/hraci', component: Hraci },
  { path: '/hrac/:name', component: Hrac },
  { path: '/partneri', component: Partneri },
  { path: '/oceneni', component: Oceneni },
  {
    path: '/media/:page?',
    component: Media,
    props: { perPage: 12 },
  },
  { path: '/kontakt', component: Kontakt },
  { path: '/cookies', component: Cookies },
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
