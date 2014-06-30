'use strict';

/**
 * Protractor e2e tests.
 */
describe('upload_request', function() {

  var upload_request = require('./upload_request.pageobject.js');

  beforeEach(function() {
    upload_request.navigate();
  });

  it('should render upload_request template when user navigates to /upload_request', function() {
    expect(upload_request.p).toEqual('Some text in upload_request state');
  });

  it('should render all animals', function() {
    expect(upload_request.animals.count()).toBe(3);
  });

  it('should show checkmark and cross', function() {
    expect(upload_request.list.last().getText()).toEqual('\u2714\n\u2718');
  });

});
