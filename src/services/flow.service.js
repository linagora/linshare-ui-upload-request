import Vue from 'vue';
import Flow from '@flowjs/flow.js';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@/services';

let flow;

function getFlowObject() {
  return flow;
}

function initFlowObject(options) {
  resetFlowObject();

  flow = new Flow({
    ...ConfigService.get().flowSettings,
    generateUniqueIdentifier: () => uuidv4(),
    target: `${location.origin}${ConfigService.get().apiUrl}/flow/upload`,
    ...options,
  });

  initDirectives(flow);
}

function resetFlowObject() {
  if (flow) {
    flow.off();
    flow.cancel();
    flow = undefined;
  }
}

function initDirectives(flow) {
  Vue.directive('flowBrowse', {
    bind(el) {
      flow.assignBrowse(el);
    }
  });

  Vue.directive('flowDroppable', {
    bind(el, binding) {
      if (binding.value) {
        flow.assignDrop(el);
      }
    },
    update(el, binding) {
      if (binding.value === binding.oldValue) {
        return;
      }

      if (!binding.value) {
        flow.unAssignDrop(el);
      } else {
        flow.assignDrop(el);
      }
    },
    unbind(el) {
      flow.unAssignDrop(el);
    }
  });
}

export const FlowService = {
  initFlowObject,
  resetFlowObject,
  getFlowObject
};
