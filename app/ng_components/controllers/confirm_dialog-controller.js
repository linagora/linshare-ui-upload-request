'use strict';

goog.provide('my.confirm_dialog.Ctrl');

/**
 * Angular bootstrap modal controller for simple confirm dialog.
 *
 * @param {!angular-bootstrap.$modalInstance} $modalInstance
 * @param {String} content
 * @constructor
 * @ngInject
 * @export
 */
my.confirm_dialog.Ctrl = function($modalInstance, content) {
  /**
   * @type {!angular-bootstrap.$modalInstance}
   */
  this.$modalInstance_ = $modalInstance;

  /**
   * @type {String}
   * @expose
   */
  this.content = content;
};

/**
 * Validate the dialog
 *
 * @export
 */
my.confirm_dialog.Ctrl.prototype.validate = function() {
  var $modalInstance = this.$modalInstance_;

  return $modalInstance.close();
};

/**
 * Cancel the dialog
 *
 * @export
 */
my.confirm_dialog.Ctrl.prototype.cancel = function() {
  var $modalInstance = this.$modalInstance_;

  return $modalInstance.dismiss('cancel');
};
