'use strict';

goog.provide('my.upload_request.Ctrl');

/**
 * UploadRequest controller.
 *
 * @param {!angular.$filter} $filter
 * @param {!angular-boostrap.$modal} $modal
 * @param {!ngTable.ngTableParams} ngTableParams
 * @param {!angular-growl.growl} growl
 * @param {!my.app.locale} locale
 * @param {!my.upload_request.UploadRequest} tmhDynamicLocale
 * @constructor
 * @ngInject
 * @export
 */
my.upload_request.Ctrl = function($filter, $modal, ngTableParams, growl, locale, UploadRequest) {

  /**
   * @type {!angular-boostrap.$modal}
   */
  this.$modal_ = $modal;

  /**
   * @type {!angular-growl.growl}
   */
  this.growl_ = growl;

  /**
   * @type {!my.upload_request.Service}
   */
  this.UploadRequest_ = UploadRequest;

  /**
   * @type {!my.app.locale}
   */
  this.locale_ = locale;

  /**
   * @type {Object}
   * @expose
   */
  this.request = {};

  /**
   * @type {String}
   * @expose
   */
  this.urlUuid = UploadRequest.urlUuid;

  var self = this;

  // Avoid JsHint warning
  var NgTableParams = ngTableParams;
  /**
   * @type {!ngTable.ngTableParams}
   */
  this.tableParams = new NgTableParams({
    page: 1,
    count: 10,
    sorting: {
      name: 'asc'
    }
  }, {
    debugMode: false,
    total: 0,
    getData: function($defer, params) {
      UploadRequest.get().then(function() {
        self.request = UploadRequest.request;
        self.locale_.changeLanguage(self.request.locale);
        var orderedData = params.sorting() ?
            $filter('orderBy')(self.request.entries, params.orderBy()) :
            self.request.entries;
        params.total(orderedData.length);
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      });
    }
  });
};
/**
 * Close the request
 *
 * @export
 */
my.upload_request.Ctrl.prototype.closeRequest = function() {
  var $modal = this.$modal_;
  var UploadRequest = this.UploadRequest_;
  var tableParams = this.tableParams;

  var modalInstance = $modal.open({
    templateUrl: 'states/upload_request/upload_request-closure.tpl.html',
    controller: ['$scope', '$modalInstance', 'content', function($scope, $modalInstance, content) {
      $scope.modal = {};
      $scope.modal.content = content;
      $scope.modal.validate = function() {
        $modalInstance.close();
      };
      $scope.modal.cancel = function() {
        $modalInstance.dismiss();
      };
    }],
    resolve: {
      content: function() {
        return 'PARAGRAPH_CONFIRM_CLOSURE';
      }
    }
  });
  modalInstance.result.then(function success() {
    UploadRequest.close().then(function success() {
      tableParams.reload();
    });
  });
};

/**
 * Delete a request entry
 *
 * @export
 */
my.upload_request.Ctrl.prototype.deleteEntry = function(entry) {
  var UploadRequest = this.UploadRequest_;
  var tableParams = this.tableParams;

  UploadRequest.deleteEntry(entry.uuid).then(function() {
    tableParams.reload();
  });
};

/**
 * Change the language of the form
 *
 * @param {String} key The language (eg. 'en')
 * @export
 */
my.upload_request.Ctrl.prototype.changeLanguage = function(key) {
  var locale = this.locale_;

  locale.changeLanguage(key);
};

/**
 * Return human readable file size
 *
 * @param {Number} bytes The number of bytes
 * @param {Boolean} si SI standard (if false use IEC standard)
 * @export
 */
my.upload_request.Ctrl.prototype.humanFileSize = function(bytes, si) {
  var thresh = si ? 1000 : 1024;
  if (bytes < thresh) return bytes + ' B';
  var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
  var u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (bytes >= thresh);
  return bytes.toFixed(1) + ' ' + units[u];
};

/**
 * Validation 
 *
 * @param {Array} files All files to validate
 * @export
 */
my.upload_request.Ctrl.prototype.validateFiles = function(files) {
  var request = this.request;
  var growl = this.growl_;

  var currentDepositFile = 0;
  var len = files.length;

  if (request.maxFileCount < (len + request.entries.length)) {
    console.error('Files count exceeded');
    console.error(files);
    growl.addErrorMessage('VALIDATION_ERROR.MAX_FILE_COUNT');
    return false;
  }
  for (var i = 0; i < len; i++) {
    if (request.maxFileSize < files[i].size) {
      console.error('File too big:');
      console.error(files[i]);
      growl.addErrorMessage('VALIDATION_ERROR.MAX_FILE_SIZE');
      return false;
    }
    if (request.extensions.indexOf(files[i].getExtension()) === -1) {
      console.error('Invalid extension');
      console.error(files[i]);
      growl.addErrorMessage('VALIDATION_ERROR.INVALID_EXTENSION');
      return false;
    }
  }
  if (request.maxDepositSize && request.maxDepositSize < (currentDepositFile + request.usedSpace)) {
    console.error('Deposit too big');
    growl.addErrorMessage('VALIDATION_ERROR.MAX_DEPOSIT_SIZE');
    return false;
  }
};

/**
 * Get the progress bar type for angular-bootstrap
 *
 * @param {!flow.File} file
 * @export
 */
my.upload_request.Ctrl.prototype.getProgressbarType = function(file) {
  if (file.isComplete()) {
    if (file.error) {
      return 'danger';
    }
    return 'success';
  }
  return 'default';
};

/**
 * Handle flow js errors 
 *
 * @param {!flow.File} file
 * @export
 */
my.upload_request.Ctrl.prototype.handleError = function(file, message) {
  var growl = this.growl_;

  console.error(file);
  message = angular.fromJson(message);
  console.error(message.message);
  growl.addErrorMessage('SERVER_ERROR.ERRCODE_' + message.errCode);
};
