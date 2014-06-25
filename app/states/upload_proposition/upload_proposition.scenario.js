'use strict';

/**
 * Protractor e2e tests.
 */
describe('upload_proposition', function() {

  var upload_proposition = require('./upload_proposition.pageobject.js');

  beforeEach(function() {
    upload_proposition.navigate();
  });

  it('should render upload_proposition template when user navigates to /upload_proposition', function() {
    expect(upload_proposition.p).toEqual('Some text in upload_proposition state');
  });

  it('should render all animals', function() {
    expect(upload_proposition.animals.count()).toBe(3);
  });

  it('should show checkmark and cross', function() {
    expect(upload_proposition.list.last().getText()).toEqual('\u2714\n\u2718');
  });

});
