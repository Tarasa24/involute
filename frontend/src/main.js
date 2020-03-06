import Vue from 'vue';
import VueRouter from 'vue-router';
import Vue2TouchEvents from 'vue2-touch-events';

import App from './App.vue';
import Home from './pages/Home';
import Novinky from './pages/Novinky';
import Novinka from './pages/Novinka';
import Hraci from './pages/Hraci';
import Partneri from './pages/Partneri';
import Hrac from './pages/Hrac';
import NotFound from './pages/NotFound';

Vue.use(VueRouter);
Vue.use(Vue2TouchEvents);

const routes = [
  { path: '/', component: Home },
  {
    path: '/novinky/:page?',
    component: Novinky,
    props: route => ({ page: route.params.page || 1 }),
  },
  { path: '/novinka/:id', component: Novinka },
  { path: '/hraci', component: Hraci },
  { path: '/partneri', component: Partneri },
  { path: '/hrac/:game/:name', component: Hrac },
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
