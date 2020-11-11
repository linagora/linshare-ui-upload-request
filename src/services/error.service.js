import { ApiService } from '@/services';
import { UploadRequestStore, PasswordStore } from '@/store';
import { ERRORS } from '@/constants';

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
      return ERRORS.PASSWORD_INCORRECT;
    }
    if (error.response.data.errCode === 32402) {
      return ERRORS.PASSWORD_RESET_REQUIRED;
    }
  }
}

export const ErrorService = {
  checkError,
  checkPasswordError
};
