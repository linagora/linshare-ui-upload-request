'use strict';

/**
 * Create namespace.
 */
goog.provide('my.upload_proposition.module');

/**
 * Require controller.
 */
goog.require('my.upload_proposition.Ctrl');



/**
 * UploadProposition module.
 *
 * @return {angular.Module}
 */
my.upload_proposition.module = angular.module('upload_proposition', [
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
my.upload_proposition.module.configuration = function($stateProvider) {

  $stateProvider.state('upload_proposition', {
    url: '/upload_proposition',
    templateUrl: 'states/upload_proposition/upload_proposition.html',
    controller: 'UploadPropositionCtrl as upload_proposition'
  });

};



/**
 * Init upload_proposition module.
 */
my.upload_proposition.module
.config(my.upload_proposition.module.configuration)
.controller('UploadPropositionCtrl', my.upload_proposition.Ctrl);
