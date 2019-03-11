// Config file for running Rollup in "normal" mode (non-watch)
const json = require('rollup-plugin-json');
const cjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');
const tslint = require('rollup-plugin-tslint');
const typescript = require('rollup-plugin-typescript2');
const { resolve } = require('./helper');

module.exports = {
  input: resolve('src/index.ts'),
  plugins: [
    ...(process.env.NODE_ENV ? [replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })] : []),
    json({
      include: resolve('package.json'),
      indent: ' '
    }),
    tslint(),
    typescript({
      clean: true,
      useTsconfigDeclarationDir: true,
    }),
    nodeResolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    cjs(),
  ],
  external: ['echarts', 'openlayers']
};
