'use strict';

goog.provide('my.upload_request.Ctrl');

/**
 * UploadRequest controller.
 *
 * @param {!angular-growl.growl} growl
 * @param {!my.app.locale} locale
 * @param {!my.upload_request.UploadRequest} tmhDynamicLocale
 * @constructor
 * @ngInject
 * @export
 */
my.upload_request.Ctrl = function(growl, locale, UploadRequest) {

  /**
   * @type {!my.app.locale}
   */
  this.locale_ = locale;

  /**
   * @type {!angular-growl.growl}
   */
  this.growl_ = growl;

  /**
   * @type {!my.upload_request.Service}
   */
  this.UploadRequest_ = UploadRequest;

  /**
   * @type {Object}
   * @expose
   */
  this.request = {};

  /**
   * @type {String}
   * @expose
   */
  this.urlUuid = UploadRequest.urlUuid;

  var self = this;

  UploadRequest.get().then(function() {
    self.request = UploadRequest.request;
  });
};

/**
 * Close the request
 *
 * @export
 */
my.upload_request.Ctrl.prototype.close = function() {
  var UploadRequest = this.UploadRequest_;
  var request = this.request;

  UploadRequest.close();
};

/**
 * Change the language of the form
 *
 * @param {String} key The language (eg. 'en')
 * @export
 */
my.upload_request.Ctrl.prototype.changeLanguage = function(key) {
  var locale = this.locale_;

  locale.changeLanguage(key);
};

/**
 * Return human readable file size
 *
 * @param {Number} bytes The number of bytes
 * @param {Boolean} si SI standard (if false use IEC standard)
 * @export
 */
my.upload_request.Ctrl.prototype.humanFileSize = function(bytes, si) {
  var thresh = si ? 1000 : 1024;
  if (bytes < thresh) return bytes + ' B';
  var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
  var u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (bytes >= thresh);
  return bytes.toFixed(1) + ' ' + units[u];
};

/**
 * Validation 
 *
 * @param {Array} files All files to validate
 * @export
 */
my.upload_request.Ctrl.prototype.validateFiles = function(files) {
  var request = this.request;
  var growl = this.growl_;

  var currentDepositFile = 0;
  var len = files.length;
  console.log(files);

  if (request.maxFileCount < (len + request.entries.length)) {
    console.error('Files count exceeded');
    console.error(files);
    growl.addErrorMessage('VALIDATION_ERROR.MAX_FILE_COUNT');
    return false;
  }
  for (var i = 0; i < len; i++) {
    if (request.maxFileSize < files[i].size) {
      console.error('File too big:');
      console.error(files[i]);
      growl.addErrorMessage('VALIDATION_ERROR.MAX_FILE_SIZE');
      return false;
    }
    if (request.extensions.indexOf(files[i].getExtension()) === -1) {
      console.error('Invalid extension');
      console.error(files[i]);
      growl.addErrorMessage('VALIDATION_ERROR.INVALID_EXTENSION');
      return false;
    }
  }
  if (request.maxDepositSize < (currentDepositFile + request.usedSpace)) {
    console.error('Deposit too big');
    growl.addErrorMessage('VALIDATION_ERROR.MAX_DEPOSIT_SIZE');
    return false;
  }
};
