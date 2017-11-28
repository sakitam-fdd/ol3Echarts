import ol from 'openlayers'
import echarts from 'echarts'
import { getTarget } from './helper'
import _getCoordinateSystem from './RegisterCoordinateSystem'

const _options = {
  'hideOnZooming': false,
  'hideOnMoving': false,
  'hideOnRotating': false
}

class ol3Echarts {
  constructor (chartOptions, options = {}) {
    /**
     * layer options
     * @type {{}}
     */
    this.$options = Object.assign(options, _options)

    /**
     * chart options
     */
    this.$chartOptions = chartOptions

    /**
     * chart instance
     * @type {null}
     */
    this.$chart = null

    /**
     * map
     * @type {null}
     */
    this.$Map = null

    /**
     * Whether the relevant configuration has been registered
     * @type {boolean}
     * @private
     */
    this._isRegistered = false
  }

  /**
   * append layer to map
   * @param map
   */
  appendTo (map) {
    if (map && map instanceof ol.Map) {
      this.$Map = map
      this.render()
      this._unRegisterEvents()
      this._registerEvents()
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
    this._clearAndRedraw()
    return this
  }

  /**
   * get map
   * @returns {null}
   */
  getMap () {
    return this.$Map
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
    this._unRegisterEvents()
    delete this.$chart
    delete this.$Map
    this.$container.parentNode.removeChild(this.$container)
  }

  /**
   * clear chart
   */
  clear () {
    this.$chart.clear()
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
    container.style.right = 0
    container.style.buttom = 0
    let _target = getTarget(options['target'])
    if (_target && _target[0] && _target[0] instanceof Element) {
      _target[0].appendChild(container)
    } else {
      map.getViewport().appendChild(container)
    }
  }

  /**
   * Reset the container size
   * @private
   */
  _resizeContainer () {
    const size = this.getMap().getSize()
    this.$container.style.height = size[1] + 'px'
    this.$container.style.width = size[0] + 'px'
  }

  /**
   * clear chart and redraw
   * @private
   */
  _clearAndRedraw () {
    if (this.$container && this.$container.style.display === 'none') {
      return
    }
    this.$chart.clear()
    this.$chart.resize()
    if (this.$chartOptions) {
      this._registerMap()
      this.$chart.setOption(this.$chartOptions, false)
    }
  }

  /**
   * handle map resize
   */
  onResize () {
    this._resizeContainer()
    this._clearAndRedraw()
  }

  /**
   * handle zoom start events
   */
  onZoomStart () {
    if (!this.$options['hideOnZooming']) {
      return
    }
    this.hide()
  }

  /**
   * handle zoom end events
   */
  onZoomEnd () {
    // if (!this.$options['hideOnZooming']) {
    //   return
    // }
    this.show()
    this._clearAndRedraw()
  }

  /**
   * handle rotate start
   */
  onDragRotateStart () {
    if (!this.$options['hideOnRotating']) {
      return
    }
    this.hide()
  }

  /**
   * handle rotate end events
   */
  onDragRotateEnd () {
    // if (!this.$options['hideOnRotating']) {
    //   return
    // }
    this.show()
    this._clearAndRedraw()
  }

  /**
   * handle move start events
   */
  onMoveStart () {
    if (!this.$options['hideOnMoving']) {
      return
    }
    this.hide()
  }

  /**
   * handle move end events
   */
  onMoveEnd () {
    // if (!this.$options['hideOnMoving']) {
    //   return
    // }
    this.show()
    this._clearAndRedraw()
  }

  /**
   * register events
   * @private
   */
  _registerEvents () {
    const Map = this.$Map
    const view = Map.getView()
    Map.on('change:size', this.onResize, this)
    view.on('change:resolution', this.onZoomEnd, this)
    view.on('change:center', this.onMoveEnd, this)
    view.on('change:rotation', this.onDragRotateEnd, this)
    Map.on('movestart', this.onMoveStart, this)
    Map.on('moveend', this.onMoveEnd, this)
  }

  /**
   * un register events
   * @private
   */
  _unRegisterEvents () {
    const Map = this.$Map
    const view = Map.getView()
    Map.un('change:size', this.onResize, this)
    view.un('change:resolution', this.onZoomEnd, this)
    view.un('change:center', this.onMoveEnd, this)
    view.un('change:rotation', this.onDragRotateEnd, this)
    Map.un('movestart', this.onMoveStart, this)
    Map.un('moveend', this.onMoveEnd, this)
  }

  /**
   * register map coordinate system
   * @private
   */
  _registerMap () {
    if (!this._isRegistered) {
      echarts.registerCoordinateSystem('openlayers', _getCoordinateSystem(this.getMap(), this.$options))
      this._isRegistered = true
    }
    const series = this.$chartOptions.series
    if (series) {
      for (let i = series.length - 1; i >= 0; i--) {
        series[i]['coordinateSystem'] = 'openlayers'
        series[i]['animation'] = false
      }
    }
  }

  /**
   * render
   */
  render () {
    if (!this.$container) {
      this._createLayerContainer(this.$Map, this.$options)
      this._resizeContainer()
    }
    if (!this.$chart) {
      this.$chart = echarts.init(this.$container)
      if (this.$chartOptions) {
        this._registerMap()
        this.$chart.setOption(this.$chartOptions, false)
      }
    } else if (this._isVisible()) {
      this.$chart.resize()
    }
  }
}

export default ol3Echarts
