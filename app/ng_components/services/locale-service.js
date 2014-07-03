'use strict';

goog.provide('my.locale.Service');

/**
 * Binding between angular-translate and angular-dynamic-locale.
 *
 * @param {angular.log} $log
 * @param {pascalprecht.translate.$translate} $translate
 * @param {tmh.dynamicLocale.tmhDynamicLocale} tmhDynamicLocale
 * @constructor
 * @ngInject
 */
my.locale.Service = function($log, $translate, tmhDynamicLocale) {
  /**
   * @type {angular.log}
   */
  this.$log_ = $log;

  /**
   * @type {!pascalprecht.translate}
   */
  this.$translate_ = $translate;

  /**
   * @type {!tmh.dynamicLocale}
   */
  this.tmhDynamicLocale_ = tmhDynamicLocale;
  
  this.lang = $translate.use();
  tmhDynamicLocale.set(this.lang);
};

/**
 * Change the language of the app
 *
 * @param {String} key The language (eg. 'en')
 * @export
 */
my.locale.Service.prototype.changeLanguage = function(key) {
  var $log = this.$log_;
  var $translate = this.$translate_;
  var tmhDynamicLocale = this.tmhDynamicLocale_;

  $log.debug('change language to ' + key);
  $translate.use(key);
  tmhDynamicLocale.set(key);
};
