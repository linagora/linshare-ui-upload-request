'use strict';

goog.provide('my.ie_upload_request.Ctrl');

/**
 * UploadRequest controller.
 *
 * @param {!angular.$filter} $filter
 * @param {!angular-boostrap.$modal} $modal
 * @param {!ngTable.ngTableParams} ngTableParams
 * @param {!angular-growl.growl} growl
 * @param {!my.app.locale} locale
 * @param {!my.upload_request.UploadRequest} tmhDynamicLocale
 * @param {!angularFileUpload} FileUploader
 * @param {!my.app.lsAppConfig} lsAppConfig The linshare configuration
 * @constructor
 * @ngInject
 * @export
 */
my.ie_upload_request.Ctrl = function($http, $filter, $modal, ngTableParams, growl, locale, UploadRequest, FileUploader, lsAppConfig, $log) {

    /**
     * @type {!angular-boostrap.$modal}
     */
    this.$modal_ = $modal;

    /**
     * @type {!angular-boostrap.$filter}
     */
    this.$filter_ = $filter;

    /**
     * @type {angular.log}
     */
    this.$log_ = $log;

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
     * @nocollapse
     */
    this.request = {};

    /**
     * @type {String}
     * @nocollapse
     */
    this.urlUuid = UploadRequest.urlUuid;

    this.password = UploadRequest.password;

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
        counts: [],
        getData: function($defer, params) {
            UploadRequest.get().then(function() {
                self.request = UploadRequest.request;
                self.password = UploadRequest.password;
                self.locale_.changeLanguage(self.request.locale);
                var orderedData = params.sorting() ?
                    $filter('orderBy')(self.request.entries, params.orderBy()) :
                    self.request.entries;
                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            });
        }
    });

    /**
     * @type {FileUploader}
     * @nocollapse
     */
    this.uploader = new FileUploader({
        url: [lsAppConfig.fqdn, lsAppConfig.backendURL, 'flow/upload/iexplorer'].join('/'),
        removeAfterUpload: true
    });

    this.uploader.filters.push({
        name: 'customFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < self.request.maxFileCount - self.tableParams.data.length;
        }
    });

    this.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        var $filter = this.$filter_;
        var date = $filter('date')(new Date(), 'H:mm:ss');
        var msg = $filter('translate')('VALIDATION_ERROR.MAX_FILE_COUNT');
        growl.addErrorMessage(date + '<br/>' + msg);
        self.$log_.debug(['onWhenAddingFileFailed', item, filter, options]);
    };
    this.uploader.onAfterAddingFile = function(fileItem) {
        if (self.request.extensions.length > 0 && self.request.extensions.indexOf(fileItem.file.type.slice(fileItem.file.type.indexOf('/') + 1)) === -1) {
            fileItem.remove();
            self.$log_.debug(['invalid extension ', fileItem]);
            var growl = self.growl_;
            var $filter = self.$filter_;
            var date = $filter('date')(new Date(), 'H:mm:ss');
            var msg = $filter('translate')('VALIDATION_ERROR.INVALID_EXTENSION');
            growl.addErrorMessage(date + '<br/>' + msg, {ttl: 5000});
        }
        self.$log_.debug(['onAfterAddingFile', fileItem]);
    };
    this.uploader.onAfterAddingAll = function(addedFileItems) {
        self.$log_.debug(['onAfterAddingAll', addedFileItems]);
    };
    this.uploader.onBeforeUploadItem = function(item) {
        self.$log_.debug(['onBeforeUploadItem', item]);
    };
    this.uploader.onProgressItem = function(fileItem, progress) {
        self.$log_.debug(['onProgressItem', fileItem, progress]);
    };
    this.uploader.onProgressAll = function(progress) {
        self.$log_.debug(['onProgressAll', progress]);
    };
    this.uploader.onSuccessItem = function(fileItem, response, status, headers) {
        self.tableParams.reload();
        var bodyObject = response;
        var growl = self.growl_;

        if (angular.isString(response) && (/^<pre>/).test(response)) {
            var body = response.replace(/<\/?pre>/ig, '');
            bodyObject = angular.fromJson(body);
        }
        if (bodyObject.errCode === 0) growl.addSuccessMessage('VALIDATION_SUCCESS.ON_SUCCESS', {ttl: 5000});
        else {
            var $filter = self.$filter_;
            var date = $filter('date')(new Date(), 'H:mm:ss');
            var msg = $filter('translate')('SERVER_ERROR.ERRCODE_' + bodyObject.errCode);
            growl.addErrorMessage(date + '<br/>' + msg, {ttl: 5000});
        }
        self.$log_.debug(['onSuccessItem', fileItem, bodyObject.message, status, headers]);
    };
    this.uploader.onErrorItem = function(fileItem, response, status, headers) {
        self.$log_.debug(['onErrorItem', fileItem, response, status, headers]);
    };
    this.uploader.onCancelItem = function(fileItem, response, status, headers) {
        self.$log_.debug(['onCancelItem', fileItem, response, status, headers]);
    };
    this.uploader.onCompleteItem = function(fileItem, response, status, headers) {
        self.$log_.debug(['onCompleteItem', fileItem, response, status, headers]);
    };
    this.uploader.onCompleteAll = function() {
        self.$log_.debug(['onCompleteAll']);
    };
    self.$log_.debug(['uploader', this.uploader]);
};


/**
 * Close the request
 *
 * @export
 */
my.ie_upload_request.Ctrl.prototype.closeRequest = function () {
    var $modal = this.$modal_;
    var UploadRequest = this.UploadRequest_;
    var tableParams = this.tableParams;

    var modalInstance = $modal.open({
        templateUrl: 'states/upload_request/upload_request-closure.tpl.html',
        controller: ['$scope', '$modalInstance', 'content', function ($scope, $modalInstance, content) {
            $scope.modal = {};
            $scope.modal.content = content;
            $scope.modal.validate = function () {
                $modalInstance.close();
            };
            $scope.modal.cancel = function () {
                $modalInstance.dismiss();
            };
        }],
        resolve: {
            content: function () {
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
my.ie_upload_request.Ctrl.prototype.deleteEntry = function (entry) {
    var UploadRequest = this.UploadRequest_;
    var tableParams = this.tableParams;

    UploadRequest.deleteEntry(entry.uuid).then(function () {
        tableParams.reload();
    });
};

/**
 * Change the language of the form
 *
 * @param {String} key The language (eg. 'en')
 * @export
 */
my.ie_upload_request.Ctrl.prototype.changeLanguage = function (key) {
    var locale = this.locale_;

    locale.changeLanguage(key);
    // change local value on the scope
    my.ie_upload_request.Ctrl.prototype.lang = key;
};

/**
 * Return human readable file size
 *
 * @param {Number} bytes The number of bytes
 * @param {Boolean} si SI standard (if false use IEC standard)
 * @export
 */
my.ie_upload_request.Ctrl.prototype.humanFileSize = function (bytes, si) {
    var thresh = si ? 1000 : 1024;
    if (bytes < thresh) return bytes + ' B';
    var units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
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
my.ie_upload_request.Ctrl.prototype.validateFiles = function (files) {
    var request = this.request;
    var growl = this.growl_;
    var $filter = this.$filter_;
    var $log = this.$log_;
    var date = $filter('date')(new Date(), 'H:mm:ss');
    var msg;

    var currentDepositFile = 0;
    var len = files.length;

    if (request.maxFileCount < (len + request.entries.length)) {
        $log.error('Files count exceeded');
        $log.error(files);
        msg = $filter('translate')('VALIDATION_ERROR.MAX_FILE_COUNT');
        growl.addErrorMessage(date + '<br/>' + msg);
        return false;
    }
    for (var i = 0; i < len; i++) {
        if (request.maxFileSize < files[i].size) {
            $log.error('File too big:');
            $log.error(files[i]);
            msg = $filter('translate')('VALIDATION_ERROR.MAX_FILE_SIZE');
            growl.addErrorMessage(date + '<br/>' + msg);
            return false;
        }
        if (request.extensions.length > 0 && request.extensions.indexOf(files[i].getExtension()) === -1) {
            $log.error('Invalid extension');
            $log.error(files[i]);
            msg = $filter('translate')('VALIDATION_ERROR.INVALID_EXTENSION');
            growl.addErrorMessage(date + '<br/>' + msg);
            return false;
        }
    }
    if (request.maxDepositSize && request.maxDepositSize < (currentDepositFile + request.usedSpace)) {
        $log.error('Deposit too big');
        msg = $filter('translate')('VALIDATION_ERROR.MAX_DEPOSIT_SIZE');
        growl.addErrorMessage(date + '<br/>' + msg);
        return false;
    }
};

/**
 * Get the progress bar type for angular-bootstrap
 *
 * @param {!flow.File} file
 * @export
 */
my.ie_upload_request.Ctrl.prototype.getProgressbarType = function (file) {
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
my.ie_upload_request.Ctrl.prototype.handleError = function (file, message) {
    var growl = this.growl_;
    var $filter = this.$filter_;
    var $log = this.$log_;
    var date = $filter('date')(new Date(), 'H:mm:ss');

    $log.error(file);
    message = angular.fromJson(message);
    $log.error(message.message);
    var msg = $filter('translate')('SERVER_ERROR.ERRCODE_' + message.errCode);
    growl.addErrorMessage(date + '<br/>' + msg);
};

