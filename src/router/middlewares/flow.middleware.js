import { FlowService } from '@/services';
import { store } from '@/store';

export const initFlowObjectMw = async function({ to, next }) {
  const requestId = to.params.id;

  FlowService.initFlowObject({
    query: {
      requestUrlUuid: requestId,
      password: encodeURIComponent(store.getters.password)
    }
  });

  next();
};