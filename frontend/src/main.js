import Vue from 'vue';
import VueRouter from 'vue-router';
import Vue2TouchEvents from 'vue2-touch-events';
import VueProgressBar from 'vue-progressbar';

import App from './App.vue';
import Home from './pages/Home';
import Novinky from './pages/Novinky';
import Novinka from './pages/Novinka';
import Hraci from './pages/Hraci';
import Hrac from './pages/Hrac';
import Partneri from './pages/Partneri';
import NotFound from './pages/NotFound';

Vue.use(VueRouter);
Vue.use(Vue2TouchEvents);
Vue.use(VueProgressBar, {
  color: '#A65BDA',
  failedColor: 'red',
  height: '2px',
});

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
