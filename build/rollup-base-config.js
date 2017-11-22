// Config file for running Rollup in "normal" mode (non-watch)

const path = require('path');
const buble = require('rollup-plugin-buble'); // ES2015 tran
const cjs = require('rollup-plugin-commonjs');
const localResolve = require('rollup-plugin-local-resolve');
const nodeResolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');
const _package = require('../package.json')
const year = new Date().getFullYear();
const banner = `/*!\n * ${_package.name} v${_package.version}\n * LICENSE : ${_package.license}\n * (c) 2017-${year} ${_package.homepage}\n */`;

const resolve = _path => path.resolve(__dirname, '../', _path)

const genConfig = (opts) => {
  const config = {
    input: {
      input: resolve('src/index.js'),
      plugins: [
        cjs(),
        buble(),
        localResolve(),
        nodeResolve({
          module: true,
          jsnext: true,
          main: true
        })
      ],
      external: id => {
        console.log(id)
        if (/echarts/.test(id)) {
          return 'echarts'
        } else if (/ol\/layer\/layer/) {
          return 'ol.layer.Layer'
        }
      }
    },
    output: {
      file: opts.file,
      format: opts.format,
      banner,
      name: _package.namespace
    }
  }
  if (opts.env) {
    config.input.plugins.unshift(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }
  return config
}

const handleMinEsm = name => {
  if (typeof name === 'string') {
    let arr_ = name.split('.')
    let arrTemp = []
    arr_.forEach((item, index) => {
      if (index < arr_.length - 1) {
        arrTemp.push(item)
      } else {
        arrTemp.push('min')
        arrTemp.push(item)
      }
    })
    return arrTemp.join('.')
  }
}

module.exports = [
  {
    file: resolve(_package.unpkg),
    format: 'umd',
    env: 'development'
  },
  {
    file: resolve(handleMinEsm(_package.unpkg)),
    format: 'umd',
    env: 'production'
  },
  {
    file: resolve(_package.main),
    format: 'cjs'
  },
  {
    file: resolve(_package.module),
    format: 'es'
  }
].map(genConfig)
