import { ApiService } from '@/services';

let uploadRequests = {};

function get(id) {
  return uploadRequests[id];
}

function assign(id, data) {
  uploadRequests[id] = uploadRequests[id] || {};
  Object.assign(uploadRequests[id], data);
}

function del(id) {
  if (uploadRequests[id]) {
    delete uploadRequests[id];
  }
}

async function fetch(id, forceNewFetch) {
  if (!forceNewFetch) {
    const uploadRequest = get(id);

    if (uploadRequest) {
      return uploadRequest;
    }
  }
  const uploadRequestResponse = await ApiService.getById('requests', id);

  assign(id, uploadRequestResponse.data);
  
  return uploadRequestResponse.data;
}

export const UploadRequestStore = {
  get,
  assign,
  del,
  fetch
};