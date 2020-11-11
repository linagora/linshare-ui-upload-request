import { ErrorService } from '@/services';

export const checkPasswordMw = async function ({ to, next, redirect }) {
  const requestId = to.params.id;
  const errorAuthenticated = await ErrorService.checkPasswordError(requestId);

  if (!errorAuthenticated) {
    redirect({ name: 'home', params: { id: requestId }});
  } else {
    if (errorAuthenticated === 1) {
      next();
    } else if (errorAuthenticated === 2) {
      redirect({ name: 'update-password', params: { id: requestId }});
    }
  }
};

export const checkUpdatePasswordMw = async function ({ to, next, redirect }) {
  const requestId = to.params.id;
  const errorAuthenticated = await ErrorService.checkPasswordError(requestId);

  if (!errorAuthenticated) {
    redirect({ name: 'home', params: { id: requestId }});
  } else {
    if (errorAuthenticated === 1) {
      redirect({ name: 'password', params: { id: requestId }});
    } else if (errorAuthenticated === 2) {
      next();
    }
  }
};