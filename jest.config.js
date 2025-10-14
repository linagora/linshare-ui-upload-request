module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  setupFiles: ['./tests/unit/setup.js'],
  setupFilesAfterEnv: ['./tests/unit/setupAfterEnv.js'],
  transform: {
    '^.+\\.vue$': '@vue/vue2-jest',
    '^.+\\.js$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios)/'
  ],
  moduleFileExtensions: ['js', 'json', 'vue'],
  testEnvironment: 'jsdom'
};
