'use strict';

/**
 * Karma unit tests.
 */
describe('UploadRequestCtrl', function(){

  var ctrl;

  beforeEach(module('upload_request'));

  beforeEach(inject(function($injector) {

    var $rootScope = $injector.get('$rootScope');
    var $controller = $injector.get('$controller');

    ctrl = $controller('UploadRequestCtrl', {
      $scope: $rootScope.$new()
    });
  }));

  it('should set the default value of "content" model', function() {
    expect(ctrl.animals).toEqual({});
  });

});
