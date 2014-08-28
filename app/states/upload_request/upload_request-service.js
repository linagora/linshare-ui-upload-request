'use strict';

goog.provide('my.upload_request.Service');

/**
 * UploadRequest service.
 *
 * @param {!angular.$q} $q
 * @param {!angular.$log} $log The angular log service
 * @param {!angular.$http} $http The angular http service
 * @param {!angular.ui.$stateParams} $stateParams The angular ui router service
 * @param {!my.app.lsAppConfig} lsAppConfig The linshare configuration
 * @constructor
 * @ngInject
 */
my.upload_request.Service = function($q, $http, $log, $stateParams, $state, growl, auth, lsAppConfig) {
  /**
   * @type {!angular.$q}
   */
  this.$q_ = $q;

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
   * @type {!angular.ui.$state}
   */
  this.$state = $state;

  /**
   * @type {!angular-growl.growl}
   */
  this.growl_ = growl;

  /**
   * @type {angular.Service}
   */
  this.auth_ = auth;

  /**
   * @type {!my.app.lsAppConfig}
   */
  this.lsAppConfig_ = lsAppConfig;

  /**
   * @type {String}
   */
  this.apiUrl_ = 'requests';

  this.request = {};

  this.password = '';

  this.urlUuid = $stateParams.uuid;
};

/**
 * Get the request
 */
my.upload_request.Service.prototype.get = function() {
  var $q = this.$q_;
  var $http = this.$http_;
  var $log = this.$log_;
  var $stateParams = this.$stateParams_;
  var $state = this.$state;
  var growl = this.growl_;
  var auth = this.auth_;
  var lsAppConfig = this.lsAppConfig_;
  var apiUrl = this.apiUrl_;
  var password = this.password;
  var self = this;

  var deferred = $q.defer();
  (function doQuery(password) {
    $http.get([lsAppConfig.backendURL, apiUrl, $stateParams.uuid].join('/'),
      {
        headers: {'linshare-uploadrequest-password': password}
      }).
      success(function(data) {
        self.request = data;
        $log.debug(data);
        deferred.resolve(data);
      }).
      error(function(data, status) {
        if (status === 401) {
          auth.getPassword().then(function(passwd) {
            self.password = passwd;
            doQuery(passwd);
          });
        } else if (status === 403 || status === 404) {
          $state.go('404');
        } else {
          growl.addErrorMessage('SERVER_ERROR.UNKNOWN_ERROR');
          $log.error(data);
          $log.error(status);
        }
    });
  }(password));
  return deferred.promise;
};

/**
 * Close the request
 */
my.upload_request.Service.prototype.close = function() {
  var $q = this.$q_;
  var $http = this.$http_;
  var $log = this.$log_;
  var auth = this.auth_;
  var lsAppConfig = this.lsAppConfig_;
  var apiUrl = this.apiUrl_;
  var request = this.request;
  var password = this.password;
  var self = this;

  var deferred = $q.defer();
  request.closed = true;
  (function doQuery(password) {
    $http.put([lsAppConfig.backendURL, apiUrl, request.uuid].join('/'), {},
      {
        headers: {'linshare-uploadrequest-password': password}
      }).
      success(function(data) {
        self.request = data;
        $log.debug(data);
        deferred.resolve(data);
      }).
      error(function(data, status) {
        if (status === 401) {
          auth.getPassword().then(function(passwd) {
            self.password = passwd;
            doQuery(passwd);
          });
        } else {
          $log.error(data);
          $log.error(status);
        }
    });
  }(password));
  return deferred.promise;
};

/**
 * Delete a request entry
 * @param {String} entryUuid
 */
my.upload_request.Service.prototype.deleteEntry = function(entryUuid) {
  var $q = this.$q_;
  var $http = this.$http_;
  var $log = this.$log_;
  var auth = this.auth_;
  var lsAppConfig = this.lsAppConfig_;
  var apiUrl = this.apiUrl_;
  var request = this.request;
  var password = this.password;
  var self = this;

  var deferred = $q.defer();
  (function doQuery(password) {
    $http.delete([lsAppConfig.backendURL, apiUrl, request.uuid, entryUuid].join('/'),
      {
        headers: {'linshare-uploadrequest-password': password}
      }).
      success(function(data) {
        self.request = data;
        $log.debug(data);
        deferred.resolve(data);
      }).
      error(function(data, status) {
        if (status === 401) {
          auth.getPassword().then(function(passwd) {
            self.password = passwd;
            doQuery(passwd);
          });
        } else {
          $log.error(data);
          $log.error(status);
        }
    });
  }(password));
  return deferred.promise;
};
