// Config file for running Rollup in "normal" mode (non-watch)
const json = require('rollup-plugin-json');
const buble = require('rollup-plugin-buble');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');
const { eslint } = require('rollup-plugin-eslint');
const typescript = require('rollup-plugin-typescript2');
const friendlyFormatter = require('eslint-friendly-formatter');

const { resolve } = require('./utils');
const ol = require('./ol/external');

const input = process.env.input;

module.exports = {
  input: resolve(input),
  plugins: [
    replace({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
    json({
      indent: ' '
    }),
    eslint({
      useEslintrc: false,
      configFile: resolve('.eslintrc.js'),
      ignorePath: resolve('.eslintignore'),
      formatter: friendlyFormatter,
      exclude: [
        '**/**.css',
        '**/**.scss',
        '**/**.less',
        'node_modules',
        resolve('node_modules')
      ]
    }),
    typescript({
      clean: true,
      useTsconfigDeclarationDir: true,
    }),
    nodeResolve({
      mainFields: ['module', 'main'], // Default: ['module', 'main']
      browser: true,  // Default: false
      extensions: [ '.mjs', '.js', '.json', '.node', 'jsx' ],  // Default: [ '.mjs', '.js', '.json', '.node' ]
      preferBuiltins: true,  // Default: true
      // Any additional options that should be passed through
      // to node-resolve
      // customResolveOptions: {
      //   moduleDirectory: 'js_modules'
      // }
    }),
    commonjs(),
    buble({
      objectAssign: true
    }),
  ],
  external: [
    ...ol,
    'echarts'
  ]
};
