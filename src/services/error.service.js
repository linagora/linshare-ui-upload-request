import { ApiService } from '@/services';
import { UploadRequestStore, PasswordStore } from '@/store';

async function checkError(id, pw) {
  try {
    const password = pw ? pw : PasswordStore.get(id);
    const uploadRequest = await ApiService.getById('requests', id, {
      headers: {
        'linshare-uploadrequest-password': password
      }
    });

    UploadRequestStore.assign(id, uploadRequest.data);
    
    return;
  } catch (error) {
    UploadRequestStore.assign(id, {});

    return error;
  }
}

async function checkPasswordError(id, password) {
  const error = await checkError(id, password);
  
  if ( error && error.response && error.response.status === 401 && error.response.data) {
    if (error.response.data.errCode === 32401) {
      return 1;
    }
    if (error.response.data.errCode === 32402) {
      return 2;
    }
  }

  return 0;
}

export const ErrorService = {
  checkError,
  checkPasswordError
};
