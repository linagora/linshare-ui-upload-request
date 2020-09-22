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
    return `You cannot upload more than ${maxFileCount} files`;
  }

  if (file.size > maxFileSize) {
    return `Your file cannot exceed ${formatBytes(maxFileSize)}`;
  }

  if (file.size + usedSpace > maxDepositSize) {
    return 'There is not enough space on your upload storage';
  }
}