import ol from 'openlayers'
class EchartsLayer {
  constructor (chartOptions, options = {}) {
    this.$chartOptions = chartOptions
    this.$chart = null
  }

  /**
   * creat eclayer container
   * @param map
   * @param options
   * @private
   */
  _createLayerContainer (map, options) {
    const container = this.$container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.top = 0
    container.style.left = 0
    let _target = this.getTarget(options['target'])
    if (_target && _target[0] && _target[0] instanceof Element) {
      _target[0].appendChild(container)
    } else {
      map.getViewport().appendChild(container)
    }
  }

  /**
   * get parent container
   * @param selector
   */
  getTarget (selector) {
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
   * append layer to map
   * @param map
   */
  appendTo (map) {
    if (map && map instanceof ol.Map) {

    } else {
      throw new Error('not map object')
    }
  }

  /**
   * get echarts options
   * @returns {*}
   */
  getChartOptions () {
    return this.$chartOptions
  }

  /**
   * set echarts options and reRender
   * @param options
   * @returns {EchartsLayer}
   */
  setChartOptions (options = {}) {
    this.$chartOptions = options
    return this
  }

  /**
   * is visible
   * @returns {Element|*|boolean}
   * @private
   */
  _isVisible () {
    return this.$container && this.$container.style.display === ''
  }

  /**
   * show layer
   */
  show () {
    if (this.$container) {
      this.$container.style.display = ''
    }
  }

  /**
   * hide layer
   */
  hide () {
    if (this.$container) {
      this.$container.style.display = 'none'
    }
  }

  /**
   * remove layer
   */
  remove () {
    this.$chart.clear()
    this.$chart.dispose()
    delete this.$chart
    delete this.map
    this.$container.parentNode.removeChild(this.$container)
  }

  clear () {
    this.$chart.clear()
  }

  /**
   * options
   * @type {{hideOnZooming: boolean, hideOnMoving: boolean, hideOnRotating: boolean}}
   */
  static options = {
    'hideOnZooming': false,
    'hideOnMoving': false,
    'hideOnRotating': false
  }
}
export default EchartsLayer
