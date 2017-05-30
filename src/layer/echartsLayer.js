var echarts = require('echarts')
/**
 * 创建独立对象
 * @param map
 */
var EchartsComponent = function (map) {
  this.map = map
  var size = this.map.getSize()
  var div = document.createElement('div')
  div.style.position = 'absolute'
  div.style.height = size[1] + 'px'
  div.style.width = size[0] + 'px'
  div.style.top = 0
  div.style.left = 0
  this.map.getViewport().appendChild(div)
  this._echartsContainer = div
  this.chart = echarts.init(div)
  if (!echarts) {
    throw new Error('请先引入echarts3！')
  }
  echarts.Map = map
  this.resize()
}
/**
 * 移除echarts
 */
EchartsComponent.prototype.remove = function () {
  this._echartsContainer.parentNode.removeChild(this._echartsContainer)
  this.map = undefined
  echarts.Map = undefined
}
/**
 * 响应地图尺寸变化
 */
EchartsComponent.prototype.resize = function () {
  var that = this
  var size = this.map.getSize()
  that._echartsContainer.style.width = size[0] + 'px'
  that._echartsContainer.style.height = size[1] + 'px'
  window.onresize = function () {
    that.chart.resize()
  }
}

module.exports = EchartsComponent
