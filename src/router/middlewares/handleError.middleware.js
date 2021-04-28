import { ErrorService } from '@/services';
import { ERRORS } from '@/constants';

export const handleErrorMw = async function({ to, next, redirect }) {
  const requestId = to.params.id;
  const error = await ErrorService.checkError(requestId);

  if (!error) {
    return next();
  }

  if (error.getMessage() === ERRORS.PASSWORD_INCORRECT) {
    return redirect({ name: 'password', params: { id: requestId }});
  } else if (error.getMessage() === ERRORS.PASSWORD_RESET_REQUIRED) {
    return redirect({ name: 'update-password', params: { id: requestId }});
  }

  return redirect({ name: 'error', params: { status: error.getStatus() || 500, errCode: error.getErrorCode()}});
};