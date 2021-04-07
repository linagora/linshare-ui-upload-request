window.APP_CONFIGS = Object.freeze({
  apiUrl: '/linshare/webservice/rest/uploadrequest/v4',
  flowSettings: {
    // Size of a chunk when uploading files, default value is 10Mb
    chunkSize: 10e6,
    simultaneousUploads: 1,
    permanentErrors:[401, 404, 500, 501],
    successStatuses: [200]
  }
});
