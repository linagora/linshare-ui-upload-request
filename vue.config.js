const LINSHARE_BACKEND_URL = process.env.LINSHARE_BACKEND_URL || 'http://localhost:30000';
const path = require('path');
const pdfjsDirectory = path.dirname(require.resolve('pdfjs-dist/package.json'));

module.exports = {
  'transpileDependencies': [
    'vuetify'
  ],
  chainWebpack(config) {
    config.plugin('copy').tap(args => {
      // Keep the worker and decoding resources on the app origin, from the same release.
      const resources = {
        // Module workers also work with .js, including on servers without an .mjs MIME type.
        'legacy/build/pdf.worker.min.mjs': 'pdf.worker.min.js',
        cmaps: 'cmaps',
        'standard_fonts': 'standard_fonts',
        wasm: 'wasm',
        'web/images': 'images'
      };

      Object.entries(resources).forEach(([resource, target]) => {
        args[0].patterns.push({
          from: path.join(pdfjsDirectory, resource),
          to: `pdfjs/${target}`,
          globOptions: { ignore: ['**/quickjs*', '**/LICENSE*QUICKJS'] },
          info: { minimized: true }
        });
      });

      return args;
    });
  },
  devServer: {
    port: 20083,
    proxy: {
      '/linshare/webservice/': {
        target: LINSHARE_BACKEND_URL,
        ws: true,
        changeOrigin: true
      }
    }
  },
  publicPath: './'
};
