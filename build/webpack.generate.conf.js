'use strict'
const rm = require('rimraf');
const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const webpackConfig = merge(require('./webpack.base.conf'), {
  mode: 'production',
  entry: {
    app: './website/index.js'
  },
  module: {
    rules: utils.styleLoaders({
      sourceMap: true,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: false,
  output: {
    path: utils.resolve('_site'),
    filename: utils.assetsPath('scripts/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('scripts/[id].[chunkhash].js'),
    publicPath: './',
    library: undefined,
    libraryTarget: 'var',
    umdNamedDefine: false
  },
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: false,
      parallel: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      allChunks: true
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true,
        map: {
          inline: false
        }
      }
    }),
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'website/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'auto'
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),

    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: 'website/static',
        to: 'static',
        ignore: ['.*']
      }
    ])
  ],
  optimization: {
    // chunk for the webpack runtime code and chunk manifest
    runtimeChunk: {
      name: 'manifest'
    },
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          test: 'vendor',
          name: 'vendor',
          enforce: true
        }
      }
    }
  }
});

module.exports = new Promise((resolve, reject) => {
  rm(path.join(utils.resolve('_site')), err => {
    if (err) throw err;
    resolve(webpackConfig)
  })
});
