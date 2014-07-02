'use strict';

goog.provide('my.upload_request.Ctrl');

/**
 * UploadRequest controller.
 *
 * @param {!angular.$http} $http The angular http service
 * @param {!angular.ui.$stateParams} $stateParams The angular ui router service
 * @param {pascalprecht.translate.$translate} $translate
 * @param {tmh.dynamicLocale.tmhDynamicLocale} tmhDynamicLocale
 * @param {!my.app.lsAppConfig} lsAppConfig The linshare configuration
 * @constructor
 * @ngInject
 * @export
 */
my.upload_request.Ctrl = function($http, $stateParams, $translate, tmhDynamicLocale, lsAppConfig) {

  /**
   * @type {!angular.http}
   */
  this.http_ = $http;

  /**
   * @type {!pascalprecht.translate}
   */
  this.translate_ = $translate;

  /**
   * @type {!tmh.dynamicLocale}
   */
  this.tmhDynamicLocale_ = tmhDynamicLocale;

  /**
   * @type {!my.app.lsAppConfig}
   */
  this.lsAppConfig_ = lsAppConfig;

  /**
   * @type {Object}
   * @expose
   */
  this.request = {};

  /**
   * @type {String}
   * @expose
   */
  this.urlUuid = $stateParams.uuid;

  tmhDynamicLocale.set($translate.use());

  var self = this;

  $http.get(lsAppConfig.backendURL + '/requests/' + $stateParams.uuid,
    {
      headers: {'linshare-uploadrequest-password': '1qm6xtpyu93qp'}
    }).
    success(function(data) {
      self.request = data;
      console.log(data);
    }).
    error(function(data, status) {
      console.error(data);
      console.error(status);
  });
};

/**
 * Close the request
 *
 * @export
 */
my.upload_request.Ctrl.prototype.close = function() {
  var http = this.http_;
  var lsAppConfig = this.lsAppConfig_;
  var request = this.request;

  console.debug('CLOSE');
  http.put(lsAppConfig.backendURL + '/requests', request);
};

/**
 * Change the language of the form
 *
 * @param {String} key The language (eg. 'en')
 * @export
 */
my.upload_request.Ctrl.prototype.changeLanguage = function(key) {
  var translate = this.translate_;
  var tmhDynamicLocale = this.tmhDynamicLocale_;

  translate.use(key);
  tmhDynamicLocale.set(key);
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
  console.log(files);

  angular.forEach(files, function(f) {

  });
  //if (request.maxFileSize < request.maxFileSize) {
  //}
};
