import { AuthService, StorageService, ApiService } from '@/services';

export const checkPasswordMw = async function ({ to, next, vueNext }) {
  const requestId = to.params.id;
  const password = StorageService.getPassword(requestId);
  const isPasswordAuthenticated = await AuthService.checkPassword(requestId, password);
  ApiService.setHeaders({
    'linshare-uploadrequest-password': password
  });

  if (isPasswordAuthenticated) {
    next();
  } else {
    vueNext({ name: 'password', params: { id: requestId }});
  }
};

export const checkGuestMw = async function ({ to, next, vueNext }) {
  const requestId = to.params.id;
  const password = StorageService.getPassword(requestId);
  const isPasswordAuthenticated = await AuthService.checkPassword(requestId, password);

  if (isPasswordAuthenticated) {
    vueNext({ name: 'home', params: { id: requestId }});
  } else {
    next();
  }
};

export const setHeaderAPI = function ({ to, next }) {
  const password = StorageService.getPassword(to.params.id);
  ApiService.setHeaders({
    'linshare-uploadrequest-password': password
  });
  next();
};