import { AuthService, StorageService, ApiService } from '@/services';

export const checkPasswordMw = async function ({ to, next, redirect }) {
  const requestId = to.params.id;
  const password = StorageService.getPassword(requestId);
  const isPasswordAuthenticated = await AuthService.checkPassword(requestId, password);

  ApiService.setHeaders({
    'linshare-uploadrequest-password': password
  });

  if (isPasswordAuthenticated) {
    next();
  } else {
    redirect({ name: 'password', params: { id: requestId }});
  }
};

export const checkGuestMw = async function ({ to, next, redirect }) {
  const requestId = to.params.id;
  const password = StorageService.getPassword(requestId);
  const isPasswordAuthenticated = await AuthService.checkPassword(requestId, password);

  if (isPasswordAuthenticated) {
    redirect({ name: 'home', params: { id: requestId }});
  } else {
    next();
  }
};