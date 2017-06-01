var webpack = require('webpack')
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var env = require('yargs').argv.env // use --env with webpack 2
var plugins = [
  new webpack.BannerPlugin('This file is created by FDD'),
  new FriendlyErrorsPlugin()
]
var libraryName = 'ol3Echarts'
var outputFile
if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }))
  outputFile = libraryName + '.min.js'
} else {
  outputFile = libraryName + '.js'
}

module.exports = {
  entry: {
    'ol3Echarts': __dirname + '/src/index.js',
  },
  devtool: 'source-map',
  output: {
    libraryTarget: 'umd',
    library: libraryName,
    path: __dirname + '/dist/',
    filename: outputFile
  },
  externals: {
    'echarts': 'echarts'
  },
  plugins: plugins
};