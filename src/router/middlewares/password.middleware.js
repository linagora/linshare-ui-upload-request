import { ErrorService } from '@/services';
import { ERRORS } from '@/constants';

export const checkPasswordMw = async function ({ to, next, redirect }) {
  const requestId = to.params.id;
  const errorAuthenticated = await ErrorService.checkPasswordError(requestId);

  if (!errorAuthenticated) {
    redirect({ name: 'home', params: { id: requestId }});
  } else {
    if (errorAuthenticated === ERRORS.PASSWORD_INCORRECT) {
      next();
    } else if (errorAuthenticated === ERRORS.PASSWORD_RESET_REQUIRED) {
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
    if (errorAuthenticated === ERRORS.PASSWORD_INCORRECT) {
      redirect({ name: 'password', params: { id: requestId }});
    } else if (errorAuthenticated === ERRORS.PASSWORD_RESET_REQUIRED) {
      next();
    }
  }
};