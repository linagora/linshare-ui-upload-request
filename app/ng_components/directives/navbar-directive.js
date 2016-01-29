'use strict';

goog.provide('my.navbar.Directive.factory');

/**
 * A directive that displays the current logo.
 *
 * @constructor
 */
my.navbar.Directive = function(lsAppConfig) {
  this.lsAppConfig_ = lsAppConfig;

  /**
   * @type {angular.Scope}
   */
  this.scope;

  /**
   * @type {angular.JQLite}
   */
  this.elem;

  /**
   * @type {angular.Attributes}
   */
  this.attrs;
};

/**
 * Version directive factory.
 *
 * @param {angular.Service} lsAppConfig
 * @return {Object}
 * @ngInject
 */
my.navbar.Directive.factory = function(lsAppConfig) {
  var dir = new my.navbar.Directive(lsAppConfig);
  return {
    restrict: 'A',
    controller: ['locale', 'lsAppConfig', '$scope', '$rootScope', '$log', '$translate', 'tmhDynamicLocale',
      function(locale, lsAppConfig, $scope, $rootScope, $log, $translate, tmhDynamicLocale){
        $scope.getCurrentLang = $translate.use();
        $scope.setLang = function (lang) {
          $translate.use(lang);
          $scope.getCurrentLang = lang;
        };
        $rootScope.$on('$translateChangeSuccess', function() {
          var lang = $translate.use();
          $log.debug('Language: switched to ' + lang);
          tmhDynamicLocale.set(lang);
        });
        $scope.customLogo = lsAppConfig.customLogoURL;
        $scope.linshareLogo = lsAppConfig.defaultLogo;
      }
    ],
    templateUrl: 'states/templates/navbar.tpl.html'
  };
};
