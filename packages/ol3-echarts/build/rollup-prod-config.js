const { _package, banner, handleMinEsm } = require('./helper');
const baseConfig = require('./rollup-base-config');
const { uglify }  = require('rollup-plugin-uglify');

const config = Object.assign(baseConfig, {
  output: [
    {
      file: handleMinEsm(_package.main),
      format: 'umd',
      name: _package.namespace,
      banner: banner,
      extend: false,
      globals: {}
    }
  ]
});

config.plugins.push(uglify());

module.exports = config;
