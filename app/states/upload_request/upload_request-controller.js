'use strict';

goog.provide('my.upload_request.Ctrl');

/**
 * UploadRequest controller.
 *
 * @param {!angular.$http} $http The angular http service
 * @param {!pascalprecht.translate} $translate The translation service
 * @param {!my.app.lsAppConfig} lsAppConfig The linshare configuration
 * @constructor
 * @ngInject
 * @export
 */
my.upload_request.Ctrl = function($http, $translate, lsAppConfig) {

  /**
   * @type {!angular.http}
   */
  this.http_ = $http;

  /**
   * @type {!pascalprecht.translate}
   */
  this.translate_ = $translate;

  /**
   * @type {!my.app.lsAppConfig}
   */
  this.lsAppConfig_ = lsAppConfig;

  /**
   * @type {Object}
   * @expose
   */
  this.form = {};
};

/**
 * Submit the form
 *
 * @export
 */
my.upload_request.Ctrl.prototype.submit = function() {
  var http = this.http_;
  var lsAppConfig = this.lsAppConfig_;
  var form = this.form;

  console.debug('SUBMIT');
  http.post(lsAppConfig.backendURL + '/upload_request', form);
};

/**
 * Reset the form
 *
 * @export
 */
my.upload_request.Ctrl.prototype.reset = function() {
  var form = this.form;

  console.debug('RESET');
  form = {};
};

/**
 * Change the language of the form
 *
 * @param {String} key The language (eg. 'en')
 * @export
 */
my.upload_request.Ctrl.prototype.changeLanguage = function(key) {
  var translate = this.translate_;

  translate.use(key);
};
