import { UploadRequestService } from '@/services';
import { formatBytes } from '@/common/helper';

const state = {
  entries: []
};

const getters = {
  entries: state => state.entries
};

const mutations = {
  addEntries: (state, newEntries) => state.entries.unshift(...newEntries),

  setEntries: (state, entries) => state.entries = entries,

  removeEntry: (state, uuid) => state.entries = state.entries.filter(entry => entry.uuid !== uuid)
};

const actions = {
  addEntries: ({ commit }, entries) => commit('addEntries', entries),

  removeEntries: async ({ commit }, { requestId, entries }) => {
    const fulfilledEntries = [];
    const rejectedEntries = [];

    await Promise.allSettled(entries.map(entry =>
      UploadRequestService.deleteEntry(requestId, entry.uuid)
    )).then(results => results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        fulfilledEntries.push(result);
      } else if (result.status === 'rejected') {
        rejectedEntries.push({...result, uuid: entries[index].uuid});
      }
    }));

    fulfilledEntries.forEach(entry => commit('removeEntry', entry.value.data.uuid));

    return rejectedEntries.map(entry => ({uuid: entry.uuid, error: entry.reason}));
  },

  setEntries: ({ commit }, entries) => commit('setEntries', entries),

  fetchEntries: async ({ commit }, requestId) => {
    const response = await UploadRequestService.getRequestEntries(requestId);
    const normalizedEntries = response.data.map(entry => {
      entry.originalSize = entry.size;
      entry.size = formatBytes(entry.size);

      return entry;
    });

    commit('setEntries', normalizedEntries);

    return normalizedEntries;
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
