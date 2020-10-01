import { ApiService } from '@/services';
import { UploadRequestStore } from '@/store';

let passwordAuthorized = false;

export const AuthService = {
  checkPassword: async (id, password) => {
    try {
      if (passwordAuthorized) {
        return true;
      }

      const uploadRequest = await ApiService.getById('requests', id, {
        headers: {
          'linshare-uploadrequest-password': password
        }
      });

      UploadRequestStore.assign(id, uploadRequest.data);
      passwordAuthorized = true;

      return true;
    } catch (error) {
      passwordAuthorized = !(error && error.response && error.response.status === 401
        && error.response.data && error.response.data.errCode === 32401);
      
      return passwordAuthorized;
    }
  }
};
