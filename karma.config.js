module.exports = function(config) {
  config.set({
    basePath: './',
    frameworks: ['mocha', 'karma-typescript'],
    preprocessors: {
      'src/**/*.ts': ['karma-typescript'],
      'test/**/*.ts': ['karma-typescript'],
      'test/**/*.tsx': ['karma-typescript'],
    },
    files: [{pattern: 'src/**/*.ts'}, {pattern: 'test/**/*.ts'}],
    plugins: ['karma-mocha', 'karma-chrome-launcher', 'karma-typescript'],
    exclude: [],
    browserNoActivityTimeout: 1000000,
    karmaTypescriptConfig: {
      coverageOptions: {
        exclude: /test\//,
      },
      bundlerOptions: {
        transforms: [require('karma-typescript-es6-transform')()],
      },
      tsconfig: './test/tsconfig.json',
    },
    reporters: ['dots', 'karma-typescript'],
    port: 9876,
    colors: true,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true,
  });
};
