import { ApiService } from '@/services';
import { store } from '@/store';

export const setHeaderMw = async function ({ next }) {
  const password = store.getters.password;

  ApiService.setHeaders({
    'linshare-uploadrequest-password': encodeURIComponent(password)
  });
  
  next();
};