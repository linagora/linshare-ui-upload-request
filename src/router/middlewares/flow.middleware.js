import { FlowService, StorageService } from '@/services';

export const initFlowObjectMw = async function({ to, next }) {
  const requestId = to.params.id;

  FlowService.initFlowObject({
    query: {
      requestUrlUuid: requestId,
      password: StorageService.getPassword(requestId) || ''
    }
  });

  next();
};