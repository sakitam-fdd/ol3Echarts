// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// Karma configuration
// Generated on Sun Jun 02 2019 15:47:55 GMT+0800 (GMT+08:00)
if (process.env.TRAVIS_ENV) {
  process.env.CHROME_BIN = require('puppeteer').executablePath();
}

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: path.resolve(__dirname, './'),


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'karma-typescript'],


    // list of files / patterns to load in the browser
    files: [
      { pattern: 'src/**/*.ts' },
      // { pattern: '../src/**/*.+(ts|tsx)' },
      // { pattern: '../test/**/*.+(ts|tsx)' },
      { pattern: 'test/spec/**/*.ts' },
      // '../src/**/*.ts', '../test/**/*.ts'
    ],


    // list of files / patterns to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.ts': ['karma-typescript'],
      // '../src/**/*.ts': ['rollup', 'coverage'],
      'test/spec/**/*.ts': ['karma-typescript'],
    },

    karmaTypescriptConfig: {
      bundlerOptions: {
        entrypoints: /\.spec\.ts$/,
        // needed for importing es6 modules from npm packages
        transforms: [require('karma-typescript-es6-transform')()],
        resolve: {
          directories: ['src', 'test', 'node_modules'],
        },
        exclude: [
          'node_modules/@types/**',
        ],
      },
      compilerOptions: {
        // karma doesn't like es6 modules, so we compile to commonjs
        module: 'commonjs',
        moduleResolution: 'node',
      },
      coverageOptions: {
        exclude: [
          /^node_modules/,
          // we don't cover declaration or test files
          /\.(d|spec|test)\.ts/i,
          // we don't want to cover barrel files
          // /index.ts/
        ],
      },
      reports: {
        html: {
          directory: path.resolve(__dirname, 'coverage'),
          subdirectory: () => '',
        },
        lcovonly: {
          directory: path.resolve(__dirname, 'coverage'),
          subdirectory: () => '',
          filename: 'lcov.info',
        },
        text: null,
      },
      tsconfig: 'tsconfig.test.json',
      exclude: ['node_modules'],
      // include: ['test/**/*.ts', 'src/**/*.ts']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'karma-typescript'],

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers ChromeHeadless
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'ChromeHeadless'],

    // customLaunchers: {
    //   ChromeDebug: {
    //     base: 'Chrome',
    //     flags: ['--remote-debugging-port=9222'],
    //     debug: true
    //   }
    // },

    // How long does Karma wait for a browser to reconnect (in ms).
    browserDisconnectTimeout: 50000,


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
  });
};
