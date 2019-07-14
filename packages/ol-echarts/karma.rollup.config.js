// Karma configuration
// Generated on Sun Jun 24 2019 15:47:55 GMT+0800 (GMT+08:00)
const json = require('rollup-plugin-json');
const buble = require('rollup-plugin-buble');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');
const typescript = require('rollup-plugin-typescript2');

console.log(process.cwd());

module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '.',

    // https://github.com/webpack-contrib/karma-webpack/issues/298#issuecomment-367081075
    mime: {
      "text/x-typescript": ["ts"],
    },

    // plugins: [
    //   'karma-jasmine',
    //   'karma-chrome-launcher',
    //   'karma-coverage',
    //   'karma-expect',
    //   'karma-mocha',
    //   'karma-mocha-reporter',
    //   'karma-rollup-preprocessor'
    // ],

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      {
        pattern: 'src/**/*.ts',
        // watched: false,
      },
      { pattern: 'test/spec/*.ts' },
    ],


    // list of files / patterns to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.ts': ['rollup'],
      'test/**/*.ts': ['rollup'],
    },

    rollupPreprocessor: {
      plugins: [
        replace({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
        json({
          indent: ' '
        }),
        typescript({
          clean: true,
          tsconfig: 'tsconfig.test.json',
          useTsconfigDeclarationDir: true,
        }),
        nodeResolve({
          mainFields: ['module', 'main'], // Default: ['module', 'main']
          browser: true,  // Default: false
          extensions: [ '.mjs', '.js', '.json', '.node', 'ts' ],  // Default: [ '.mjs', '.js', '.json', '.node' ]
          preferBuiltins: true,  // Default: true
        }),
        commonjs({
          // include: 'node_modules/**',
        }),
        buble({
          objectAssign: true
        }),
      ],
      output: {
        format: 'iife',
        name: 'own',
        sourcemap: 'inline'
      },
      onwarn: function(message) {
        if(message.code === 'CIRCULAR_DEPENDENCY' && message.importer.indexOf('chai.js') > -1) {
          return;
        }
        // console.log(message);
      }
    },

    coverageReporter: {
      dir: 'coverage/',
      // instrumenterOptions: {
      //   istanbul: { noCompact: true }
      // },
      reporters: [
        {
          type: 'html',
          subdir: 'report-html',
        },
        {
          type: 'lcov',
          subdir: 'report-lcov',
        },
      ]
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage'],

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
    browsers: ['Chrome'],

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
