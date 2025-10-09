import { i18n } from '@/i18n';
import { formatBytes } from '@/common';

export function isPasswordValid(str) {
  //eslint-disable-next-line
  return /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?=.{12,})/.test(str);
}

export function isRequired(item) {
  return !!item;
}

export function validateUpload(files, { usedSpace, maxFileCount, maxFileSize, maxDepositSize, currentFiles }) {
  if (maxFileCount > 0 && currentFiles.length + files.length > maxFileCount) {
    return i18n.t('MESSAGE.ERROR_MAX_FILE_COUNT_EXCEEDED', {length: maxFileCount});
  }

  let totalFileSize = 0;

  for ( let i = 0; i < files.length; i++ ) {
    totalFileSize += files[i].size;
    if (maxFileSize > 0 && files[i].size > maxFileSize) {
      return i18n.t('MESSAGE.ERROR_FILE_SIZE_EXCEEDED', {size: formatBytes(maxFileSize)});
    }
  }

  if (maxDepositSize > 0 && totalFileSize + usedSpace > maxDepositSize) {
    return i18n.t('MESSAGE.ERROR_NOT_ENOUGH_SPACE');
  }
}

export function validHttpErrorStatusCode(code) {
  return [400, 401, 403, 404, 500].includes(code);
}
