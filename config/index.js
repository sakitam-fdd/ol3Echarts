const path = require('path')
module.exports = {
  build: {
    env: require('./prod.env'),
    productionSourceMap: true,
    productionGzip: true,
    productionGzipExtensions: ['js'],
    bundleAnalyzerReport: true
  },
  dev: {
    env: require('./dev.env'),
    devtoolSourceMap: '#source-map',
    cssSourceMap: true
  },
  base: {
    fileName: 'ol3Echarts',
    libraryName: 'ol3Echarts',
    distDirectory: path.resolve(__dirname, '../dist'),
    docs: path.resolve(__dirname, '../docs/examples')
  }
}
