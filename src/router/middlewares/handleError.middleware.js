import { ErrorService } from '@/services';

export const handleErrorMw = async function({ to, next, redirect }) {
  const requestId = to.params.id;
  const error = await ErrorService.checkError(requestId);

  if (!error) {
    return next();
  }

  if (error.response && error.response.status === 401 && error.response.data) {
    if (error.response.data.errCode === 32401) {
      return redirect({ name: 'password', params: { id: requestId }});
    } else if (error.response.data.errCode === 32402) {
      return redirect({ name: 'update-password', params: { id: requestId }});
    }
  }

  return redirect({ name: 'error', params: { status: error.response && error.response.status || 500}});
};