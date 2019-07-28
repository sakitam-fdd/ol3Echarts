'use strict';
const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const webpackConfig = merge(require('./webpack.base.conf'), {
  mode: 'production',
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
    new ProgressBarPlugin(),
    new CleanWebpackPlugin([
      '_site'
    ], {
      root: path.resolve(__dirname, '../')
    }),
    new webpack.DllReferencePlugin({
      manifest: require('../dll/extlib-manifest.json')
    }),
    new ParallelUglifyPlugin({
      cacheDir: path.join(__dirname, '../cache/'),
      sourceMap: false,
      uglifyES: {
        output: {
          comments: false
        },
        compress: {
          inline: 1, // https://github.com/mishoo/UglifyJS2/issues/2842
          warnings: false,
          drop_console: true
        }
      }
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
      version: new Date().toLocaleString('zh', {
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      }),
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
    new webpack.optimize.ModuleConcatenationPlugin(),

    new AddAssetHtmlPlugin({
      filepath: path.resolve(__dirname, '../dll/extlib.dll.*.js'),
      publicPath: './static/scripts',
      outputPath: '../_site/static/scripts',
      includeSourcemap: false
    }),

    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: 'website/static',
        to: 'static',
        ignore: ['.*']
      },
      {
        from: 'docs',
        to: 'docs',
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
      // 可填 async, initial, all. 顾名思义，async针对异步加载的chunk做切割，initial针对初始chunk，all针对所有chunk
      chunks: 'all',
      // 我们切割完要生成的新chunk要>30kb，否则不生成新chunk
      minSize: 30000,
      // 共享该module的最小chunk数
      minChunks: 1,
      // 最多有5个异步加载请求该module
      maxAsyncRequests: 5,
      // 初始化的时候最多有3个请求该module
      maxInitialRequests: 3,
      // 名字中间的间隔符
      automaticNameDelimiter: '.',
      // chunk的名字，如果设成true，会根据被提取的chunk自动生成。
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          // 优先级高的chunk为被优先选择,优先级一样的话，size大的优先被选择
          priority: -10,
          // 当module未变时，是否可以使用之前的chunk
          reuseExistingChunk: true
        },
        default: {
          // enforce: true,
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
  }
});

module.exports = webpackConfig;
