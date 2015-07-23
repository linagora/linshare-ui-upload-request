'use strict';

goog.require('my.upload_request.module');
goog.require('my.logo.Directive.factory');
goog.require('my.auth.Service');
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
  'angular-growl',
  'ngTable',
  my.upload_request.module.name
])
.config(config)
.directive('logo', my.logo.Directive.factory)
.service('auth', my.auth.Service)
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
 * @param {growl.growlProvider} growlProvider
 * @param {app.lsAppConfig} lsAppConfig
 * @ngInject
 */
function config($logProvider, $stateProvider, $urlRouterProvider, $translateProvider, tmhDynamicLocaleProvider, cfpLoadingBarProvider, flowFactoryProvider, growlProvider, lsAppConfig) {

  var debug = lsAppConfig.debug;
  $logProvider.debugEnabled(debug);

  $stateProvider.state('404', {
    url: '/404',
    templateUrl: 'states/404/404.html'
  });
  $urlRouterProvider.otherwise('/404');

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
    target: lsAppConfig.backendURL + '/flow/upload.json',
    permanentErrors:[401, 404, 500, 501]
  };

 growlProvider.globalEnableHtml(true);
}
