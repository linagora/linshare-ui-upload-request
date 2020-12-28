import Vue from 'vue';
import Flow from '@flowjs/flow.js';
import { v4 as uuidv4 } from 'uuid';
import { API_URL } from '@/config';

let flow;

function getFlowObject() {
  return flow;
}

function initFlowObject(options) {
  flow = new Flow({
    ...options,
    target: `${location.origin}${API_URL}/flow/upload`,
    simultaneousUploads: 1,
    generateUniqueIdentifier: () => uuidv4(),
    permanentErrors:[401, 404, 500, 501]
  });

  initDirectives();
}

function initDirectives() {
  Vue.directive('flowBrowse', {
    bind(el) {
      flow.assignBrowse(el);
    }
  });

  Vue.directive('flowDroppable', {
    update(el, binding) {
      if (!binding.value) {
        flow.unAssignDrop(el);
      } else {
        flow.assignDrop(el);
      }
    }
  });
}

export const FlowService = {
  initFlowObject,
  getFlowObject
};