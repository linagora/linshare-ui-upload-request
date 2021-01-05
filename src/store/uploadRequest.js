import { ApiService, UploadRequestService } from '@/services';

const state = {
  uploadRequest: {},
  password: ''
};

const getters = {
  uploadRequest: state => state.uploadRequest,
  password: state => state.password
};

const mutations = {
  setUploadRequest: (state, uploadRequest) => state.uploadRequest = uploadRequest,

  closeUploadRequest: state => state.uploadRequest.closed = true,

  setPassword: (state, password) => state.password = password
};
    
const actions = {
  setUploadRequest: ({ commit }, uploadRequest) => commit('setUploadRequest', uploadRequest),

  closeUploadRequest: async ({ commit }) => {
    await UploadRequestService.updateRequest(state.uploadRequest.uuid, { closed: true });

    commit('closeUploadRequest');
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
  