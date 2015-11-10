angular.module('app').constant('lsAppConfig', {
  backendURL: 'linshare/webservice/rest/uploadrequest', // default: 'linshare/webservice/rest/uploadrequest'
  customLogoURL: undefined, // eg: 'http://my.app/logo.png' // default: undefined
  defaultLogo: 'img/logo_linshare.png', // put undefined to remove the logo  or put the url or the relative path (from index.html file) of the logo // default: 'img/logo_linshare.png'
  debug: true // use false in production
});
