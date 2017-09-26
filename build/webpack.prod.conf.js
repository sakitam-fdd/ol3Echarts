const path = require('path')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.conf')
const webpackConfig = merge(baseWebpackConfig, {
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.build.env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: false
    }),
    // copy example to docs
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../examples'),
        to: config.base.docs
      }
    ])
  ]
})
if (config.build.productionGzip) { // Gzip压缩
  var CompressionWebpackPlugin = require('compression-webpack-plugin')
  webpackConfig.plugins.push(new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 0,
      minRatio: 0.8
    })
  )
}
if (config.build.bundleAnalyzerReport) { // 打包结果分析
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    analyzerHost: '127.0.0.1',
    analyzerPort: 8888,
    reportFilename: 'report.html',
    defaultSizes: 'parsed'
  }))
}
module.exports = webpackConfig
