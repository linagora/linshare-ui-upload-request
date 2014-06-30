'use strict';

/**
 * Create Page Object for protractor e2e tests.
 */

var UploadRequest = function() {

  this.navigate = function() {
    browser.get('index.html#/upload_request');
  };

  // single dom element selector
  this.p = $('p').getText();

  // select multiple elements
  this.list = $$('ul');

  // ng-repeat
  this.animals = element.all(by.repeater('animal in upload_request.animals'));

};

module.exports = new UploadRequest();
