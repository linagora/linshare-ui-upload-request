const LINSHARE_BACKEND_URL = process.env.LINSHARE_BACKEND_URL || 'http://localhost:30000';
module.exports = {
  'transpileDependencies': [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '/linshare/webservice/': {
        target: LINSHARE_BACKEND_URL,
        ws: true,
        changeOrigin: true
      }
    }
  }
};