'use strict';

goog.provide('my.upload_request.Service');

/**
 * UploadRequest service.
 *
 * @param {!angular.$log} $log The angular log service
 * @param {!angular.$http} $http The angular http service
 * @param {!angular.ui.$stateParams} $stateParams The angular ui router service
 * @param {!my.app.lsAppConfig} lsAppConfig The linshare configuration
 * @constructor
 * @ngInject
 */
my.upload_request.Service = function($http, $log, $stateParams, lsAppConfig) {

  /**
   * @type {String}
   */
  this.apiUrl_ = 'requests';

  /**
   * @type {!angular.http}
   */
  this.$http_ = $http;

  /**
   * @type {!angular.log}
   */
  this.$log_ = $log;

  /**
   * @type {!angular.ui.$stateParams}
   */
  this.$stateParams_ = $stateParams;

  /**
   * @type {!my.app.lsAppConfig}
   */
  this.lsAppConfig_ = lsAppConfig;

  this.request = {};

  this.urlUuid = $stateParams.uuid;
};

/**
 * Get the request
 */
my.upload_request.Service.prototype.get = function() {
  var apiUrl = this.apiUrl_;
  var $http = this.$http_;
  var $log = this.$log_;
  var $stateParams = this.$stateParams_;
  var lsAppConfig = this.lsAppConfig_;
  var self = this;

  return $http.get([lsAppConfig.backendURL, apiUrl, $stateParams.uuid].join('/'),
    {
      headers: {'linshare-uploadrequest-password': '1qm6xtpyu93qp'}
    }).
    success(function(data) {
      self.request = data;
      $log.debug(data);
    }).
    error(function(data, status) {
      $log.error(data);
      $log.error(status);
  });
};

/**
 * Close the request
 */
my.upload_request.Service.prototype.close = function() {
  var apiUrl = this.apiUrl_;
  var $http = this.$http_;
  var $log = this.$log_;
  var lsAppConfig = this.lsAppConfig_;
  var request = this.request;

  request.closed = true;
  return $http.put([lsAppConfig.backendURL, apiUrl, request].join('/'),
    {
      headers: {'linshare-uploadrequest-password': '1qm6xtpyu93qp'}
    }).
    success(function(data) {
      self.request = data;
      $log.debug(data);
    }).
    error(function(data, status) {
      $log.error(data);
      $log.error(status);
  });
};

/**
 * Delete a request entry
 * @param {String} entryUuid
 */
my.upload_request.Service.prototype.deleteEntry = function(entryUuid) {
  var apiUrl = this.apiUrl_;
  var $http = this.$http_;
  var $log = this.$log_;
  var lsAppConfig = this.lsAppConfig_;
  var request = this.request;

  return $http.delete([lsAppConfig.backendURL, apiUrl, request.uuid, entryUuid].join('/'),
    {
      headers: {'linshare-uploadrequest-password': '1qm6xtpyu93qp'}
    }).
    success(function(data) {
      self.request = data;
      $log.debug(data);
    }).
    error(function(data, status) {
      $log.error(data);
      $log.error(status);
  });
};
