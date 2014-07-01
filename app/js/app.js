'use strict';

goog.require('my.upload_request.module');
goog.require('my.locale.Service');

/**
 * Main app.
 */
angular.module('app', [
  'ngLocale',
  'ngSanitize',
  'ngCookies',
  'ngResource',
  'ui.router',
  'ui.bootstrap',
  'pascalprecht.translate',
  'tmh.dynamicLocale',
  'chieffancypants.loadingBar',
  'flow',
  my.upload_request.module.name
])
.config(config)
.service('locale', my.locale.Service);

/**
 * Configuration function.
 *
 * @param {ng.$logProvider} $logProvider
 * @param {ui.router.$stateProvider} $stateProvider
 * @param {ui.router.$urlRouterProvider} $urlRouterProvider
 * @param {pascalprecht.translate.$translateProvider} $translateProvider
 * @param {tmh.dynamicLocale.tmhDynamicLocaleProvider} tmhDynamicLocaleProvider
 * @param {chieffancypants.loadingBar.cfpLoadingBarProvider} cfpLoadingBarProvider
 * @param {flow.flowFactoryProvider} flowFactoryProvider
 * @param {app.lsAppConfig} lsAppConfig
 * @ngInject
 */
function config($logProvider, $stateProvider, $urlRouterProvider, $translateProvider, tmhDynamicLocaleProvider, cfpLoadingBarProvider, flowFactoryProvider, lsAppConfig) {

  var debug = lsAppConfig.debug;
  $logProvider.debugEnabled(debug);

  $urlRouterProvider.otherwise('/uploadrequest');

  $translateProvider.useStaticFilesLoader({
    prefix: 'i18n/locale-',
    suffix: '.json'
  });
  $translateProvider.preferredLanguage('en');
  $translateProvider.addInterpolation('$translateMessageFormatInterpolation');
  $translateProvider.useMissingTranslationHandlerLog();
  $translateProvider.useCookieStorage();

  tmhDynamicLocaleProvider.localeLocationPattern('i18n/angular/angular-locale_{{locale}}.js');

  cfpLoadingBarProvider.includeSpinner = false;

  flowFactoryProvider.defaults = {
    simultaneousUploads: 1,
    generateUniqueIdentifier: function() {
      return uuid.v4();
    },
    target: '/linshare/flow/upload',
    permanentErrors:[401, 404, 500, 501]
  };
}
