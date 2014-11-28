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
goog.require('my.ie_upload_request.Ctrl');
goog.require('my.auth.Service');
goog.require('my.locale.Service');


/**
 * UploadRequest module.
 *
 * @return {angular.Module}
 */
my.upload_request.module = angular.module('upload_request', [
  'ui.router', 'angularFileUpload'
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
    views: {
        'flow':{
            templateUrl: 'states/upload_request/upload_request.html',
            controller: 'UploadRequestCtrl as upload_request'
        },
        'ie_upload': {
            templateUrl: 'states/upload_request/ie_upload_request.html',
            controller: 'IeUploadRequestCtrl as ie_upload_request'
        }
    }
  });

};



/**
 * Init upload_request module.
 */
my.upload_request.module
.config(my.upload_request.module.configuration)
.controller('UploadRequestCtrl', my.upload_request.Ctrl)
.controller('IeUploadRequestCtrl', my.ie_upload_request.Ctrl)
.service('UploadRequest', my.upload_request.Service);
