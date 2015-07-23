'use strict';

goog.provide('my.auth.Service');

/**
 * Authentication service
 *
 * @param {angular.Scope} $rootScope
 * @param {angular.log} $log
 * @param {angular-bootstrap.$modal} $modal
 * @constructor
 * @ngInject
 */
my.auth.Service = function($rootScope, $log, $modal) {
  /**
   * @type {angular.log}
   */
  this.$log_ = $log;

  /**
   * @type {angular-bootstrap.$modal}
   */
  this.$modal_ = $modal;
};

my.auth.Service.prototype.getPassword = function() {
  var $modal = this.$modal_;

  var modalInstance = $modal.open({
    backdrop: 'static',
    controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
      $scope.modal = {};
      $scope.modal.password = '';
      $scope.modal.validate = function() {
        $modalInstance.close($scope.modal.password);
      };
    }],
    template: [
      '<div class="modal-header">',
        '<h3 class="modal-title">',
          'Password',
        '</h3>',
      '</div>',
      '<div class="modal-body">',
        '<input type="password" class="form-control" placeholder="Password" x-ng-model="modal.password">',
      '</div>',
      '<div class="modal-footer">',
        '<button class="btn btn-primary" x-ng-click="modal.validate()" type="submit">',
          'OK',
        '</button>',
      '</div>'
    ].join('\n')
  });
  return modalInstance.result;
};
