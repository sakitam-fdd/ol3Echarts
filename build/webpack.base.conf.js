const path = require('path');
const utils = require('./utils');

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './website/index.js'
  },
  output: {
    path: utils.resolve('_site'),
    filename: '[name].js',
    publicPath: '/',
    libraryTarget: 'var'
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.json'
    ]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [
          utils.resolve('website')
        ],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: true
        }
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [
          utils.resolve('website'),
          utils.resolve('node_modules/webpack-dev-server/client')
        ],
        options: {
          cacheDirectory: true,
          presets: [
            [
              'env', {
                'targets': {
                  'browsers': ['> 1%', 'last 2 versions', 'not ie <= 8']
                },
                'modules': false
              }
            ],
            'stage-2',
            'react'
          ],
          plugins: [
            'react-hot-loader/babel',
            'transform-react-remove-prop-types',
            'transform-class-properties',
            'transform-object-assign',
            'transform-object-rest-spread',
            [
              'transform-runtime',
              {
                'polyfill': false
              }
            ],
            [
              'import',
              {
                'libraryName': 'antd',
                'style': false
              }
            ]
          ]
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
