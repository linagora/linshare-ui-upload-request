import { i18n } from '@/i18n';
import { formatBytes } from '@/common';

export function isPasswordValid(str) {
  //eslint-disable-next-line
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{12,})/.test(str);
}

export function isRequired(item) {
  return !!item;
}

export function validateUpload(file, { usedSpace, maxFileCount, maxFileSize, maxDepositSize, currentFiles }) {
  if (currentFiles.length >= maxFileCount) {
    return i18n.t('MESSAGE.ERROR_MAX_FILE_COUNT_EXCEEDED', {length: maxFileCount});
  }

  if (file.size > maxFileSize) {
    return i18n.t('MESSAGE.ERROR_FILE_SIZE_EXCEEDED', {size: formatBytes(maxFileSize)});
  }

  if (maxDepositSize && file.size + usedSpace > maxDepositSize) {
    return i18n.t('MESSAGE.ERROR_NOT_ENOUGH_SPACE');
  }
}

export function validHttpErrorStatusCode(code) {
  return [400, 401, 403, 404, 500].includes(code);
}
