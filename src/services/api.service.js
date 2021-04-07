import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { ConfigService } from '@/services';

class AppError extends Error {
  constructor (error) {
    super();
    this.errCode = error && error.response && error.response.data && error.response.data.errCode || 0;

    switch (this.errCode) {
      case 30005:
        this.message = 'MESSAGE.ERROR_READ_ONLY';
        break;
      case 30415:
        this.message = 'MESSAGE.ERROR_CLOSE_RIGHT';
        break;
      case 31408:
        this.message = 'MESSAGE.ERROR_DELETE_ENTRY_RIGHT';
        break;
      default:
        this.message = 'MESSAGE.SOMETHING_WENT_WRONG';
    }
  }

  getMessage () {
    return this.message;
  }

  getErrorCode () {
    return this.errCode;
  }
}

export const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = ConfigService.get().apiUrl;
    Vue.axios.interceptors.response.use(response => response, error => {
      throw new AppError(error);
    });
  },

  getById(resource, id = '', params) {
    return Vue.axios.get(`${resource}/${id}`, params);
  },

  post(resource, params) {
    return Vue.axios.post(`${resource}`, params);
  },

  update(resource, id, params) {
    return Vue.axios.put(`${resource}/${id}`, params);
  },

  delete(resource, id) {
    return Vue.axios.delete(`${resource}/${id}`);
  },

  setHeaders(headers) {
    Vue.axios.defaults.headers = {
      ...(Vue.axios.defaults.headers || {}),
      ...(headers || {})
    };
  }
};

export const UploadRequestService = {
  getRequest(requestId) {
    return ApiService.getById('requests', requestId);
  },
  getRequestEntries(requestId) {
    return Vue.axios.get(`requests/${requestId}/entries`);
  },
  deleteEntry(requestId, entryId) {
    return Vue.axios.delete(`requests/${requestId}/entries/${entryId}`);
  },
  updateRequest(requestId, data) {
    return ApiService.update('requests', requestId, data);
  },
  updatePassword(requestId, data) {
    return ApiService.update('password', requestId, data);
  }
};
