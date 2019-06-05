const { uglify }  = require('rollup-plugin-uglify');
const { banner, handleMinEsm, pkg, resolve } = require('./utils');
const baseConfig = require('./rollup.base.config');
const ol = require('./ol/globals');

const common = {
  banner: banner,
  extend: false,
  globals: {
    ...ol,
    'echarts': 'echarts',
  },
};

const config = Object.assign(baseConfig, {
  output: [
    {
      file: resolve(handleMinEsm(pkg.main)),
      format: 'umd',
      name: pkg.namespace,
      ...common,
    }
  ]
});

config.plugins.push(uglify());

module.exports = config;
