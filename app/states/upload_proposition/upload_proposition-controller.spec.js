'use strict';

/**
 * Karma unit tests.
 */
describe('UploadPropositionCtrl', function(){

  var ctrl;

  beforeEach(module('upload_proposition'));

  beforeEach(inject(function($injector) {

    var $rootScope = $injector.get('$rootScope');
    var $controller = $injector.get('$controller');

    ctrl = $controller('UploadPropositionCtrl', {
      $scope: $rootScope.$new()
    });
  }));

  it('should set the default value of "content" model', function() {
    expect(ctrl.animals).toEqual({});
  });

});
