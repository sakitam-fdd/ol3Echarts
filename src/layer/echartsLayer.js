import echarts from 'echarts'

/**
 * 创建echarts图层
 * @param map
 * @param params
 */
const ol3Echarts = function (map, params = {}) {
  this.map = map
  let size = this.map.getSize()
  let div = document.createElement('div')
  div.style.position = 'absolute'
  div.style.height = size[1] + 'px'
  div.style.width = size[0] + 'px'
  div.style.top = 0
  div.style.left = 0
  let _target = this.getTarget(params['target'])
  if (_target && _target[0] && _target[0] instanceof Element) {
    _target[0].appendChild(div)
  } else {
    this.map.getViewport().appendChild(div)
  }
  this._echartsContainer = div
  this.chart = echarts.init(div)
  if (!echarts) {
    throw new Error('请先引入echarts3！')
  }
  echarts.Map_ = map
  echarts.MapParams_ = params
  this.resize()
}

/**
 * 获取dom的父元素
 * @param selector
 */
ol3Echarts.prototype.getTarget = function (selector) {
  let dom = (function () {
    let found
    return (document && /^#([\w-]+)$/.test(selector))
      ? ((found = document.getElementById(RegExp.$1)) ? [found] : [])
      : Array.prototype.slice.call(/^\.([\w-]+)$/.test(selector)
        ? document.getElementsByClassName(RegExp.$1)
        : /^[\w-]+$/.test(selector) ? document.getElementsByTagName(selector)
          : document.querySelectorAll(selector)
      )
  })()
  return dom
}

/**
 * 移除echarts
 */
ol3Echarts.prototype.remove = function () {
  this._echartsContainer.parentNode.removeChild(this._echartsContainer)
  this.map = undefined
  echarts.Map_ = undefined
  echarts.MapParams_ = undefined
}

/**
 * 响应地图尺寸变化
 */
ol3Echarts.prototype.resize = function () {
  let that = this
  let size = this.map.getSize()
  let resizeEvt = (('orientationchange' in window) ? 'orientationchange' : 'resize')
  let doc = window.document
  this._echartsContainer.style.width = size[0] + 'px'
  this._echartsContainer.style.height = size[1] + 'px'
  window.addEventListener(resizeEvt, function () {
    setTimeout(function () {
      that.chart.resize()
    }, 50)
  }, false)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setTimeout(function () {
        that.chart.resize()
      }, 50)
    }
  }, false)
  if (doc.readyState === 'complete') {
    setTimeout(function () {
      that.chart.resize()
    }, 50)
  } else {
    doc.addEventListener('DOMContentLoaded', function (e) {
      setTimeout(function () {
        that.chart.resize()
      }, 50)
    }, false)
  }
}

export default ol3Echarts
