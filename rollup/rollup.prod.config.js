const { uglify }  = require('rollup-plugin-uglify');
const { banner, handleMinEsm } = require('./utils');
const baseConfig = require('./rollup.base.config');
const ol = require('./ol/globals');

const common = {
  banner: banner,
  extend: false,
  globals: {
    ...ol,
  },
};

const pkgfile = process.env.pkg;
const pkg = require(pkgfile);

const config = Object.assign(baseConfig, {
  output: [
    {
      file: handleMinEsm(pkg.main),
      format: 'umd',
      name: pkg.namespace,
      ...common,
    }
  ]
});

config.plugins.push(uglify());

module.exports = config;
