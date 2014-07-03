'use strict';

/**
 * Create namespace.
 */
goog.provide('my.upload_request.module');

/**
 * Require controller.
 */
goog.require('my.upload_request.Ctrl');
goog.require('my.upload_request.Service');



/**
 * UploadRequest module.
 *
 * @return {angular.Module}
 */
my.upload_request.module = angular.module('upload_request', [
  'ui.router'
]);



/**
 * Configuration function.
 *
 * `templateUrl` path must be relative to `index.html`.
 *
 * @param {ui.router.$stateProvider} $stateProvider
 * @ngInject
 */
my.upload_request.module.configuration = function($stateProvider) {

  $stateProvider.state('upload_request', {
    url: '/:uuid',
    templateUrl: 'states/upload_request/upload_request.html',
    controller: 'UploadRequestCtrl as upload_request'
  });

};



/**
 * Init upload_request module.
 */
my.upload_request.module
.config(my.upload_request.module.configuration)
.controller('UploadRequestCtrl', my.upload_request.Ctrl)
.service('UploadRequest', my.upload_request.Service);
