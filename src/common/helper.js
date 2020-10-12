import { i18n } from '@/i18n';

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) {return '0 Bytes';}

  const exchange = 1024;
  const digits = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const unitIndex = Math.floor(Math.log(bytes) / Math.log(exchange));

  return parseFloat((bytes / Math.pow(exchange, unitIndex)).toFixed(digits)) + ' ' + sizes[unitIndex];
}

export function validateUpload(file, { usedSpace, maxFileCount, maxFileSize, maxDepositSize, currentFiles }) {
  if (currentFiles.length >= maxFileCount) {
    return i18n.t('MESSAGE.ERROR_MAX_FILE_COUNT_EXCEEDED', {length: maxFileCount});
  }

  if (file.size > maxFileSize) {
    return i18n.t('MESSAGE.ERROR_FILE_SIZE_EXCEEDED', {size: formatBytes(maxFileSize)});
  }

  if (file.size + usedSpace > maxDepositSize) {
    return i18n.t('MESSAGE.ERROR_NOT_ENOUGH_SPACE');
  }
}

export function getColorByString(string) {
  const colors = ['#C62828', '#F57C00', '#05B1FF', '#2E7D32', '#5E35B1', '#1A237E'];
  
  return colors[string.length % colors.length];
}

export function generateHttpErrorMessage(statusCode) {
  switch (statusCode) {
    case 400:
      return i18n.t('MESSAGE.BAD_REQUEST');
    case 403:
      return i18n.t('MESSAGE.FORBIDDEN');
    case 404:
      return i18n.t('MESSAGE.NOT_FOUND');
    case 500:
      return i18n.t('MESSAGE.SOMETHING_WENT_WRONG');
    default:
      return i18n.t('MESSAGE.SOMETHING_WENT_WRONG');
  }
}

export function validHttpErrorStatusCode(code) {
  return [400, 401, 403, 404, 500].includes(code);
}