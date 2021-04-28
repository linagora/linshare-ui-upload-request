import { ApiService } from '@/services';
import { store } from '@/store';
import { ERRORS } from '@/constants';

async function checkError(id, pw) {
  try {
    const password = pw || store.getters.password;
    const uploadRequest = await ApiService.getById('requests', id, {
      headers: {
        'linshare-uploadrequest-password': password
      }
    });

    store.dispatch('setUploadRequest', uploadRequest.data);

    return;
  } catch (error) {
    store.dispatch('setUploadRequest', {});

    return error;
  }
}

async function checkPasswordError(id, password) {
  const error = await checkError(id, password);

  if (error && (error.getMessage() === ERRORS.PASSWORD_INCORRECT || error.getMessage() === ERRORS.PASSWORD_RESET_REQUIRED)) {
    return error.getMessage();
  }
}

export const ErrorService = {
  checkError,
  checkPasswordError
};
