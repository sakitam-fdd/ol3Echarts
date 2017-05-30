var PROD = process.argv.indexOf('-p') >= 0;

module.exports = {
  entry: {
    'EchartsComponent': __dirname + '/src/index.js',
  },
  output: {
    libraryTarget: 'umd',
    library: ['[name]'],
    path: __dirname + '/dist/',
    filename: PROD ? '[name].min.js' : '[name].js'
  },
  externals: {
    'echarts': 'echarts'
  }
};