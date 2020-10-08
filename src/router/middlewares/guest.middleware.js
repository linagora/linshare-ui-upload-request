import { ErrorService } from '@/services';

export const checkGuestMw = async function ({ to, next, redirect }) {
  const requestId = to.params.id;
  const isPasswordAuthenticated = await ErrorService.checkPasswordError(requestId);

  if (isPasswordAuthenticated) {
    redirect({ name: 'home', params: { id: requestId }});
  } else {
    next();
  }
};