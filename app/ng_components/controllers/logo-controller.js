'use strict';

goog.provide('my.logo.Ctrl');

/**
 * Logo controller.
 *
 * @param {!my.app.lsAppConfig} lsAppConfig
 * @constructor
 * @ngInject
 * @export
 */
my.logo.Ctrl = function(lsAppConfig) {
  /**
   * @type {!my.app.lsAppConfig}
   */
  this.lsAppConfig_ = lsAppConfig;

};

/**
 * Get custom logo url
 *
 * @export
 */
my.logo.Ctrl.prototype.getCustomLogoURL = function() {
  var lsAppConfig = this.lsAppConfig_;

  return lsAppConfig.customLogoURL;
};
