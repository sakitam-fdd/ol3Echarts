const path = require('path');
const _package = require('../package.json');
const ExtractTextPlugin = require('mini-css-extract-plugin');
const resolve = _path => path.resolve(__dirname, '..', _path);

exports.assetsPath = function (_path) {
  return path.posix.join('static', _path);
};

const cssLoaders = function (options) {
  options = options || {};
  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  };

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  };

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      });
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return [{
        loader: ExtractTextPlugin.loader,
        options: {}
      }].concat(loaders)
    } else {
      return ['style-loader'].concat(loaders);
    }
  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass')
  };
};

const styleLoaders = function (options) {
  const output = [];
  const loaders = cssLoaders(options);
  for (const extension in loaders) {
    const loader = loaders[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    });
  }
  return output;
};

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [
    resolve('src'),
    resolve('test')
  ],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: false
  }
});

/**
 * handle min file
 * @param name
 * @returns {string}
 */
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
};

module.exports = {
  _package,
  resolve,
  assetsPath,
  cssLoaders,
  styleLoaders,
  handleMinEsm,
  createLintingRule
};
