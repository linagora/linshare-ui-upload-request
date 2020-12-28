import Vue from 'vue';
import Router from 'vue-router';
import { checkPasswordMw, initFlowObjectMw, handleErrorMw, setHeaderMw, checkUpdatePasswordMw } from '@/router/middlewares';
import { middlewarePipeline } from './middleware.pipeline.js';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: () => import('@/modules/landing/Landing')
    },
    {
      path: '/error/:status?',
      name: 'error',
      component: () => import('@/modules/error/Error')
    },
    {
      path: '/:id',
      name: 'home',
      component: () => import('@/modules/home/Home'),
      meta: {
        middleware: [
          handleErrorMw,
          setHeaderMw,
          initFlowObjectMw
        ]
      }
    },
    {
      path: '/:id/password',
      name: 'password',
      component: () => import('@/modules/password/Password'),
      meta: {
        middleware: [
          checkPasswordMw,
        ]
      }
    },
    {
      path: '/:id/update-password',
      name: 'update-password',
      component: () => import('@/modules/updatePassword/UpdatePassword'),
      meta: {
        middleware: [
          checkUpdatePasswordMw
        ]
      }
    }
  ]
});

router.beforeEach(async(to, from, next) => {
  if (!to.meta.middleware || !to.meta.middleware.length) {
    return next();
  }
  const middleware = to.meta.middleware;

  const context = {
    to,
    from,
    next,
    redirect: next
  };

  return middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1)
  });
});

export default router;