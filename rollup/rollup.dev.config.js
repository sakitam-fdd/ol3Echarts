const { banner, pkg, resolve } = require('./utils');
const baseConfig = require('./rollup.base.config');
const ol = require('./ol/globals');

const common = {
  banner,
  extend: false,
  globals: {
    ...ol,
  },
};


const config = Object.assign(baseConfig, {
  output: [
    {
      file: resolve(pkg.main),
      format: 'umd',
      name: pkg.namespace,
      ...common,
    },
    {
      file: resolve(pkg.commonjs),
      format: 'cjs',
      ...common,
    },
    {
      file: resolve(pkg.module),
      format: 'es',
      ...common,
    },
  ],
});

module.exports = config;
