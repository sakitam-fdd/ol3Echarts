'use strict'
const path = require('path');
const utils = require('./helper');

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
    modules: [utils.resolve('node_modules')],
    extensions: [
      '.web.tsx', '.web.ts', '.web.jsx', '.web.js',
      '.ts', '.tsx', '.js', '.jsx',
      '.json'
    ],
    alias: {
      'react-dom': '@hot-loader/react-dom' // https://github.com/gatsbyjs/gatsby/issues/11934
    }
  },
  module: {
    rules: [
      // ...(process.env.USEESLINT ? [utils.createLintingRule()] : []),
      ...[utils.createLintingRule()],
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [
          utils.resolve('src'),
          utils.resolve('test'),
          // utils.resolve('node_modules/webpack-dev-server/client')
        ],
      },
      {
        test: /\.glsl$/,
        loader: 'raw-loader'
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
    setImmediate: false,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
