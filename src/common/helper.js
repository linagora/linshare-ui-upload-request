import { i18n } from '@/i18n';

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) {return '0 Bytes';}

  const exchange = 1000;
  const digits = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const unitIndex = Math.floor(Math.log(bytes) / Math.log(exchange));

  return parseFloat((bytes / Math.pow(exchange, unitIndex)).toFixed(digits)) + ' ' + sizes[unitIndex];
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
      return i18n.t('MESSAGE.SOMETHING_WENT_WRONG', {errCode: ''});
    default:
      return i18n.t('MESSAGE.SOMETHING_WENT_WRONG', {errCode: ''});
  }
}

export function convertSecToTimeDisplay(sec) {
  const NB_SECONDS_IN_DAY = 3600 * 24,
    NB_SECONDS_IN_HOUR = 3600,
    NB_SECONDS_IN_MIN = 60;

  function secToHour(seconds) {
    return parseInt(seconds/NB_SECONDS_IN_HOUR)  + ' h ' +
      parseInt((parseFloat(seconds/NB_SECONDS_IN_HOUR) - parseInt(seconds/NB_SECONDS_IN_HOUR)) * 60) + ' min ';
  }

  function secToMin(seconds) {
    return parseInt(seconds/NB_SECONDS_IN_MIN) + ' min ' +
      Math.round((parseFloat(seconds/NB_SECONDS_IN_MIN) - parseInt(seconds/NB_SECONDS_IN_MIN)) * 60) + ' s';
  }

  function remainingTimeToShow(seconds) {
    if (!Number.isFinite(seconds)) {
      return '-';
    }

    if (seconds < NB_SECONDS_IN_MIN) {
      return Math.round(seconds) + ' s';
    } else if (NB_SECONDS_IN_MIN <= seconds < NB_SECONDS_IN_HOUR) {
      return secToMin(seconds);
    } else if (NB_SECONDS_IN_HOUR <= seconds < NB_SECONDS_IN_DAY) {
      return secToHour(seconds);
    }
  }

  return remainingTimeToShow(sec);
}