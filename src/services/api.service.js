import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { ConfigService } from '@/services';
import { ERRORS } from '@/constants';

class AppError extends Error {
  constructor (error) {
    super();
    this.errCode = error && error.response && error.response.data && error.response.data.errCode || 0;
    this.status = error && error.response && error.response.status;

    switch (this.errCode) {
      case 30005:
        this.message = ERRORS.READONLY;
        break;
      case 30415:
        this.message = ERRORS.CLOSE_RIGHT;
        break;
      case 31408:
        this.message = ERRORS.DELETE_ENTRY_RIGHT;
        break;
      case 32401:
        this.message = ERRORS.PASSWORD_INCORRECT;
        break;
      case 32402:
        this.message = ERRORS.PASSWORD_RESET_REQUIRED;
        break;
      default:
        this.message = ERRORS.COMMON;
    }
  }

  getMessage () {
    return this.message;
  }

  getErrorCode () {
    return this.errCode;
  }

  getStatus () {
    return this.status;
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
  },
  getThumbnail(requestId, entryId, { type = 'LARGE', base64 = true, options = {} }) {
    return Vue.axios({
      ...options,
      method: 'GET',
      url: `requests/${requestId}/entries/${entryId}/thumbnail/${type}?base64=${base64}`
    });
  },
  download(requestId, entryId, otp, options = {}) {
    let url = `requests/${requestId}/entries/${entryId}/download`;

    if (otp) {
      url = `${url}?otp=${otp}`;
    }

    return Vue.axios({
      ...options,
      method: 'GET',
      url: url
    });
  },
  getOtp(params) {
    return Vue.axios.post('otp', params);
  },
};
