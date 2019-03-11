const { _package, banner } = require('./helper');
const baseConfig = require('./rollup-base-config');

module.exports = Object.assign(baseConfig, {
  output: [
    {
      file: _package.main,
      format: 'umd',
      name: _package.namespace,
      banner: banner,
      extend: false,
      globals: {}
    },
    {
      file: _package.commonjs,
      format: 'cjs',
      banner: banner,
      extend: false,
      globals: {}
    },
    {
      file: _package.module,
      format: 'es',
      banner: banner,
      extend: false,
      globals: {}
    }
  ]
});
