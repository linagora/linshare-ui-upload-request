'use strict';

goog.provide('my.auth.Service');

/**
 * Authentication service
 *
 * @param {angular.Scope} $rootScope
 * @param {angular-bootstrap.$modal} $modal
 * @constructor
 * @ngInject
 */
my.auth.Service = function($rootScope, $modal) {
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
          '{{\'AUTH_MODAL.TITLE\' | translate}}',
        '</h3>',
      '</div>',
      '<form>',
        '<div class="modal-body">',
          '<p>',
            '{{ \'AUTH_MODAL.LABEL\' | translate }}',
          '</p>',
          '<label>',
            '{{ \'AUTH_MODAL.TITLE\' | translate }}',
          '</label>',
          '<input type="password" class="form-control" placeholder="{{\'AUTH_MODAL.TITLE\' | translate}}" x-ng-model="modal.password">',
        '</div>',
        '<div class="modal-footer">',
          '<input class="btn btn-primary" x-ng-click="modal.validate()" type="submit" value="Ok" />',
        '</div>',
      '</form>'
    ].join('\n')
  });
  return modalInstance.result;
};
