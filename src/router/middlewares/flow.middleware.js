import { FlowService } from '@/services';
import { store } from '@/store';

export const initFlowObjectMw = async function({ to, next }) {
  const requestId = to.params.id;
  const password = encodeURIComponent(store.getters.password);

  FlowService.initFlowObject({
    query: (file, chunk, isTest) => {
      const query = { requestUrlUuid: requestId };

      // Flow.js puts test query parameters in the URL, upload parameters in the body.
      if (!isTest) {
        query.password = password;
      }

      return query;
    }
  });

  next();
}; 