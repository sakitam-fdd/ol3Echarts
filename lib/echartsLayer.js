/**
 * 创建独立对象
 * @param map
 */
function ol3Echarts (map) {
  this._map = map;
  var size = this._map.getSize();
  var div = this._echartsContainer = document.createElement('div');
  div.style.position = 'absolute';
  div.style.height = size[1] + 'px';
  div.style.width = size[0] + 'px';
  div.style.top = 0;
  div.style.left = 0;
  this._map.getViewport().appendChild(div);
  this.chart = echarts.init(this._echartsContainer)
  if (!echarts) {
    throw new Error('请先引入echarts3！')
  }
  echarts.olMap = map
  this.resize()
}
/**
 * 移除echarts
 */
ol3Echarts.prototype.remove = function () {
  this._echartsContainer.parentNode.removeChild(this._echartsContainer)
  this._map = undefined
}
/**
 * 响应地图尺寸变化
 */
ol3Echarts.prototype.resize = function () {
  var that = this
  window.onresize = function () {
    that._echartsContainer.style.width = that._map.getSize() + 'px'
    that._echartsContainer.style.height = that._map.getSize() + 'px'
    that.chart.resize()
  }
}

module.exports = ol3Echarts;
