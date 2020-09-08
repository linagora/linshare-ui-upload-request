import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { API_URL } from '@/config';

export const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = API_URL;
  },

  query(resource, params) {
    return Vue.axios.get(resource, params).catch(error => {
      throw new Error(`[Linshare] ApiService ${error}`);
    });
  },

  getById(resource, id = '') {
    return Vue.axios.get(`${resource}/${id}`).catch(error => {
      throw new Error(`[Linshare] ApiService ${error}`);
    });
  },

  post(resource, params) {
    return Vue.axios.post(`${resource}`, params).catch(error => {
      throw new Error(`[Linshare] ApiService ${error}`);
    });
  },

  update(resource, id, params) {
    return Vue.axios.put(`${resource}/${id}`, params).catch(error => {
      throw new Error(`[Linshare] ApiService ${error}`);
    });
  },

  delete(resource, id) {
    return Vue.axios.delete(`${resource}/${id}`).catch(error => {
      throw new Error(`[Linshare] ApiService ${error}`);
    });
  }
};

export const UploadRequestService = {
  getRequest(requestId) {
    return ApiService.getById('requests', requestId);
  },
  getRequestEntries(requestId) {
    return Vue.axios.get(`requests/${requestId}/entries`).catch(error => {
      throw new Error(`[Linshare] ApiService ${error}`);
    });
  },
  deleteEntry(requestId, entryId) {
    return Vue.axios.delete(`requests/${requestId}/entries/${entryId}`).catch(error => {
      throw new Error(`[Linshare] ApiService ${error}`);
    })
  }
};
