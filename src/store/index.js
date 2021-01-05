import Vue from 'vue';
import Vuex from 'vuex';
import uploadRequest from './uploadRequest';
import entry from './entry';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    uploadRequest,
    entry
  }
});
