'use strict';

goog.provide('my.locale.Service');

/**
 * FIXME: Never executed
 * Binding between angular-translate and angular-dynamic-locale.
 *
 * @param {angular.Scope} $rootScope
 * @param {angular.$log} $log
 * @param {pascalprecht.translate.$translate} $translate
 * @param {tmh.dynamicLocale.tmhDynamicLocale} tmhDynamicLocale
 * @constructor
 * @ngInject
 */
my.locale.Service = function($rootScope, $log, $translate, tmhDynamicLocale) {
  
  this.$rootScope = $rootScope;

  $rootScope.$on('$translateChangeSuccess', function() {
    var lang = $translate.use();
    $log.error('Language: switched to ' + lang);
    tmhDynamicLocale.set(lang);
  });
};
