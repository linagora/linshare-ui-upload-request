'use strict';

/**
 * Create Page Object for protractor e2e tests.
 */

var UploadProposition = function() {

  this.navigate = function() {
    browser.get('index.html#/upload_proposition');
  };

  // single dom element selector
  this.p = $('p').getText();

  // select multiple elements
  this.list = $$('ul');

  // ng-repeat
  this.animals = element.all(by.repeater('animal in upload_proposition.animals'));

};

module.exports = new UploadProposition();
