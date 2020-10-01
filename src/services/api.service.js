import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { API_URL } from '@/config';

export const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = API_URL;
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
  }
};
