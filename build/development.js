const config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}
const webpack = require('webpack')
const webpackConfig = require('./webpack.dev.conf')
webpack(webpackConfig, function (err, stats) {
  if (err) throw err
})