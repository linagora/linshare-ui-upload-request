import { FlowService } from '@/services';
import { PasswordStore } from '@/store';

export const initFlowObjectMw = async function({ to, next }) {
  const requestId = to.params.id;

  FlowService.initFlowObject({
    query: {
      requestUrlUuid: requestId,
      password: PasswordStore.get(requestId) || ''
    }
  });

  next();
};