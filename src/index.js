import $Layer from './Layer'
export class EchartsLayer extends $Layer {
  constructor(chartOptions, options) {
    super(options)
    this.$chartOptions = chartOptions
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
    if (this._getRenderer()) {
      this._getRenderer()._clearAndRedraw()
    }
    return this
  }

  /**
   * options
   * @type {{container: string, renderer: string, hideOnZooming: boolean, hideOnMoving: boolean, hideOnRotating: boolean}}
   */
  static options = {
    'container' : 'front',
    'renderer' : 'dom',
    'hideOnZooming' : false,
    'hideOnMoving' : false,
    'hideOnRotating' : false
  }
}
