import { ApiService, UploadRequestService } from '@/services';

const state = {
  requestId: null,
  uploadRequest: {},
  password: ''
};

const getters = {
  requestId: state => state.requestId,
  uploadRequest: state => state.uploadRequest,
  password: state => state.password
};

const mutations = {
  resetUploadRequest: (state, requestId) => {
    state.requestId = requestId;
    state.uploadRequest = {};
    state.password = '';
  },

  setUploadRequest: (state, uploadRequest) => state.uploadRequest = uploadRequest,

  setPassword: (state, password) => state.password = password
};

const actions = {
  setUploadRequest: ({ commit }, uploadRequest) => commit('setUploadRequest', uploadRequest),

  closeUploadRequest: async ({ commit }) => {
    const response = await UploadRequestService.updateRequest(state.uploadRequest.uuid, { closed: true });

    commit('setUploadRequest', response.data);
  },

  fetchUploadRequest: async ({ commit }) => {
    if (state.uploadRequest.uuid) {
      const uploadRequestResponse = await ApiService.getById('requests', state.uploadRequest.uuid);

      commit('setUploadRequest', uploadRequestResponse.data);

      return uploadRequestResponse.data;
    }
  },

  setPassword: ({ commit }, password) => commit('setPassword', password)
};

export default {
  state,
  getters,
  mutations,
  actions
};
