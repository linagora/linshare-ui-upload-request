import Vue from 'vue';
import Router from 'vue-router';
import { AuthService, StorageService, ApiService } from '@/services';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/:id',
      name: 'home',
      component: () => import('@/modules/home/Home')
    },
    {
      path: '/:id/password',
      name: 'password',
      component: () => import('@/modules/password/Password')
    }
  ]
});

// Ensure we checked auth before each page load.
router.beforeEach(async (to, from, next) => {
  // Set password in headers each time joining a new route with new id

  if (to.params && to.params.id) {
    const requestId = to.params.id;
    const password = StorageService.getPassword(requestId);
    const isPasswordAuthenticated = await AuthService.checkPassword(requestId, password);
    if (isPasswordAuthenticated) {
      // Set default password header
      ApiService.setHeaders({
        'linshare-uploadrequest-password': password
      });

      if (to.name !== 'password') {
        next();
      } else {
        next({ name: 'home', params: { id: requestId }});
      }
    } else {
      // Clear false password in local storage
      StorageService.removePassword(requestId);

      if (to.name !== 'password') {
        next({ name: 'password', params: { id: requestId }});
      } else {
        next();
      }
    }
  }
});

export default router;