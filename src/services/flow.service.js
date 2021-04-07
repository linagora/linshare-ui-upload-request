import Vue from 'vue';
import Flow from '@flowjs/flow.js';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@/services';

let flow;

function getFlowObject() {
  return flow;
}

function initFlowObject(options) {
  flow = new Flow({
    ...ConfigService.get().flowSettings,
    generateUniqueIdentifier: () => uuidv4(),
    target: `${location.origin}${ConfigService.get().apiUrl}/flow/upload`,
    ...options,
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