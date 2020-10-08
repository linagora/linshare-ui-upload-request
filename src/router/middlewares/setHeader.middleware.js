import { ApiService } from '@/services';
import { PasswordStore } from '@/store';

export const setHeaderMw = async function ({ to, next }) {
  const requestId = to.params.id;
  const password = PasswordStore.get(requestId);

  ApiService.setHeaders({
    'linshare-uploadrequest-password': password
  });
  
  next();
};