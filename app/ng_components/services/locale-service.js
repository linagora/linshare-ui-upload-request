'use strict';

goog.provide('my.locale.Service');

/**
 * Binding between angular-translate and angular-dynamic-locale
 *
 * @param {angular.$rootScope} $rootScope
 * @param {angular.$log} $log
 * @param {pascalprecht.translate.$translate} $translate
 * @param {tmh.dynamicLocale.tmhDynamicLocale} tmhDynamicLocale
 * @constructor
 * @ngInject
 */
my.locale.Service = function($rootScope, $log, $translate, tmhDynamicLocale) {
  
  $rootScope.on('$translateChangeSuccess', function() {
    var lang = $translate.use();
    $log.debug('Language: switched to ' + lang);
    tmhDynamicLocale.set(lang);
  });
};
