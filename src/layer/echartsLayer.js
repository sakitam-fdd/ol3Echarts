var echarts = require('echarts')
/**
 * 创建独立对象
 * @param map
 */
var ol3Echarts = function (map, container) {
  this.map = map
  var size = this.map.getSize()
  var div = document.createElement('div')
  div.style.position = 'absolute'
  div.style.height = size[1] + 'px'
  div.style.width = size[0] + 'px'
  div.style.top = 0
  div.style.left = 0
  if (container && container.indexOf('.') === 0) {
    var _container = this.getElementsByClassName(container, window)
    _container.appendChild(div)
  } else if (container && container.indexOf('#') === 0) {
    var _con = (typeof id === 'string' ? document.getElementById(id) : id);
    _con.appendChild(div)
  } else {
    this.map.getViewport().appendChild(div)
  }
  this._echartsContainer = div
  this.chart = echarts.init(div)
  if (!echarts) {
    throw new Error('请先引入echarts3！')
  }
  echarts.Map = map
  this.resize()
}

/**
 * 通过类名获取元素
 * @param str
 * @param root
 * @returns {HTMLElement}
 */
ol3Echarts.prototype.getElementsByClassName = function (str, root) {
  var _root = root || window
  var $ = _root.document.querySelector.bind(_root.document)
  var target = $(str)
  return target
}

/**
 * 移除echarts
 */
ol3Echarts.prototype.remove = function () {
  this._echartsContainer.parentNode.removeChild(this._echartsContainer)
  this.map = undefined
  echarts.Map = undefined
}
/**
 * 响应地图尺寸变化
 */
ol3Echarts.prototype.resize = function () {
  var that = this
  var size = this.map.getSize()
  that._echartsContainer.style.width = size[0] + 'px'
  that._echartsContainer.style.height = size[1] + 'px'
  var resizeEvt = (('orientationchange' in window) ? 'orientationchange' : 'resize')
  var doc = window.document;
  window.addEventListener(resizeEvt, function() {
    setTimeout(function () {
      that.chart.resize()
    }, 50)
  }, false);
  window.addEventListener('pageshow', function(e) {
    if (e.persisted) {
      setTimeout(function () {
        that.chart.resize()
      }, 50)
    }
  }, false);
  if (doc.readyState === 'complete') {
    setTimeout(function () {
      that.chart.resize()
    }, 50)
  } else {
    doc.addEventListener('DOMContentLoaded', function(e) {
      setTimeout(function () {
        that.chart.resize()
      }, 50)
    }, false);
  }
}

module.exports = ol3Echarts
