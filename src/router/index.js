import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/:id',
      name: 'home',
      component: () => import('@/modules/home/Home'),
    },
  ]
});
