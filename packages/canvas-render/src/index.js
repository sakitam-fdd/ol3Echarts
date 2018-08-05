import ol from 'openlayers';
import echarts from 'echarts';
import { getTarget, merge, isObject, map, bind, createCanvas, arrayAdd } from './helper';
import formatGeoJSON from './coordinate/formatGeoJSON';
import _getCoordinateSystem from './coordinate/RegisterCoordinateSystem';
import * as charts from './charts/index';
const _options = {
  forcedRerender: false, // Force re-rendering
  forcedPrecomposeRerender: false, // force pre re-render
  hideOnZooming: false, // when zooming hide chart
  hideOnMoving: false, // when moving hide chart
  hideOnRotating: false, // // when Rotating hide chart
  convertTypes: ['pie', 'line', 'bar']
};

class ol3Echarts extends ol.layer.Image {
  static getTarget = getTarget;
  static merge = merge;
  static map = map;
  static bind = bind;
  static formatGeoJSON = formatGeoJSON;
  constructor (chartOptions, options = {}, map) {
    super(options);

    /**
     * layer options
     * @type {{}}
     */
    this.$options = merge(_options, options);

    /**
     * chart options
     */
    this.$chartOptions = chartOptions;

    /**
     * chart instance
     * @type {null}
     */
    this.$chart = null;

    /**
     * Whether the relevant configuration has been registered
     * @type {boolean}
     * @private
     */
    this._isRegistered = false;

    /**
     * 增量数据存放
     * @type {Array}
     * @private
     */
    this._incremental = [];

    /**
     * coordinate system
     * @type {null}
     * @private
     */
    this._coordinateSystem = null;

    /**
     * this canvas
     * @type {null}
     * @private
     */
    this._canvas = null;

    /**
     * context
     * @type {null}
     * @private
     */
    this._context = null;

    /**
     * options
     * @type {{}}
     */
    this.options = options;

    this.setSource(
      new ol.source.ImageCanvas({
        logo: options.logo,
        state: options.state,
        attributions: options.attributions,
        resolutions: options.resolutions,
        canvasFunction: this.canvasFunction.bind(this),
        projection: options.hasOwnProperty('projection')
          ? options.projection
          : 'EPSG:3857',
        ratio: options.hasOwnProperty('ratio') ? options.ratio : window.devicePixelRatio
      })
    );

    this.on('precompose', () => {
      this.getMap().render();
    }, this);
    this.on('change:extent', this._clearAndRedraw, this);
  }

  /**
   * append layer to map
   * @param map
   */
  appendTo (map) {
    if (map && map instanceof ol.Map) {
      map.addLayer(this);
      this.setMap(map);
      map.on('change:size', this.redraw, this);
    } else {
      throw new Error('not map object');
    }
  }

  /**
   * render
   * @param _canvas
   * @private
   */
  render (_canvas) {
    if (!this.$chart) {
      // echarts.setCanvasCreator(() => {
      //   return _canvas;
      // });
      this.$chart = echarts.init(_canvas, null, {
        width: _canvas.width,
        height: _canvas.height
      });
      if (this.$chartOptions) {
        this._registerMap();
        this.$chart.setOption(this.reConverData(this.$chartOptions), false);
      }
    } else if (this.getVisible()) {
      this.$chart.resize();
      this._clearAndRedraw();
    }
  }

  /**
   * re-draw
   */
  redraw () {
    const _extent = this.options.extent || this._getMapExtent();
    this.setExtent(_extent);
  }

  /**
   * get context
   * @returns {*|CanvasRenderingContext2D|WebGLRenderingContext|ol.webgl.Context}
   */
  getContext () {
    return this._canvas.getContext(this.get('context') || '2d');
  }

  /**
   * get map current extent
   * @returns {ol.View|*|Array<number>}
   * @private
   */
  _getMapExtent () {
    if (!this.getMap()) return;
    const size = this._getMapSize();
    const _view = this.getMap().getView();
    return _view && _view.calculateExtent(size);
  }

  /**
   * get size
   * @private
   */
  _getMapSize () {
    if (!this.getMap()) return;
    return this.getMap().getSize();
  }

  /**
   * canvas constructor
   * @param extent
   * @param resolution
   * @param pixelRatio
   * @param size
   * @param projection
   * @returns {*}
   */
  canvasFunction (extent, resolution, pixelRatio, size, projection) {
    if (!this._canvas) {
      this._canvas = createCanvas(size[0], size[1]);
    } else {
      this._canvas.width = size[0];
      this._canvas.height = size[1];
    }
    if (resolution <= this.get('maxResolution')) {
      const context = this.getContext();
      this.render(this._canvas);
      this.get('render') &&
      this.get('render')({
        context: context,
        extent: extent,
        size: size,
        pixelRatio: pixelRatio,
        projection: projection
      });
    } else {
      // console.warn('超出所设置最大分辨率！')
    }
    return this._canvas;
  }

  /**
   * set map
   * @param map
   */
  setMap (map) {
    this.set('originMap', map);
    if (this.getMap()) {
      this.getMap().renderSync();
    }
    // super.setMap.call(this, map)
  }

  /**
   * get map
   */
  getMap () {
    return this.get('originMap');
  }

  /**
   * get echarts options
   * @returns {*}
   */
  getChartOptions () {
    return this.$chartOptions;
  }

  /**
   * set echarts options and reRender
   * @param options
   * @returns {ol3Echarts}
   */
  setChartOptions (options = {}) {
    this.$chartOptions = options;
    this._clearAndRedraw();
    return this;
  }

  /**
   * append data
   * @param data
   * @param save
   * @returns {ol3Echarts}
   */
  appendData (data, save = true) {
    if (data) {
      if (save) {
        this._incremental = arrayAdd(this._incremental, {
          data: data.data,
          seriesIndex: data.seriesIndex
        });
      }
      // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/copyWithin
      this.$chart.appendData({
        data: data.data.copyWithin(),
        seriesIndex: data.seriesIndex
      });
    }
    return this;
  }

  /**
   * clear layer
   */
  clear () {
    this._incremental = [];
    this.$chart.clear();
  }

  /**
   * show loading bar
   */
  showLoading () {
    if (this.$chart) {
      this.$chart.showLoading();
    }
  }

  /**
   * hide loading bar
   */
  hideLoading () {
    if (this.$chart) {
      this.$chart.hideLoading();
    }
  }

  /**
   * clear chart and redraw
   * @private
   */
  _clearAndRedraw () {
    if (!this.$chart) {
      return;
    }
    this.dispatchEvent({
      type: 'redraw',
      source: this
    });
    if (this.$options.forcedRerender) {
      this.$chart.clear();
    }
    this.$chart.resize();
    if (this.$chartOptions) {
      this._registerMap();
      this.$chart.setOption(this.reConverData(this.$chartOptions), false);
      if (this._incremental && this._incremental.length > 0) {
        for (let i = 0; i < this._incremental.length; i++) {
          this.appendData(this._incremental[i], false)
        }
      }
    }
  }

  /**
   * register map coordinate system
   * @private
   */
  _registerMap () {
    if (!this._isRegistered) {
      echarts.registerCoordinateSystem('openlayers', _getCoordinateSystem(this.getMap(), this.$options));
      this._isRegistered = true;
    }
    const series = this.$chartOptions.series;
    if (series && isObject(series)) {
      for (let i = series.length - 1; i >= 0; i--) {
        if (!(this.$options.convertTypes.indexOf(series[i]['type']) > -1)) {
          series[i]['coordinateSystem'] = 'openlayers';
        }
        series[i]['animation'] = false;
      }
    }
  }

  /**
   * 重新处理数据
   * @param options
   * @returns {*}
   */
  reConverData (options) {
    let series = options['series'];
    if (series && series.length > 0) {
      if (!this._coordinateSystem) {
        let _cs = _getCoordinateSystem(this.getMap(), this.$options);
        this._coordinateSystem = new _cs();
      }
      if (series && isObject(series)) {
        for (let i = series.length - 1; i >= 0; i--) {
          if (this.$options.convertTypes.indexOf(series[i]['type']) > -1) {
            if (series[i] && series[i].hasOwnProperty('coordinates')) {
              series[i] = charts[series[i]['type']](options, series[i], this._coordinateSystem);
            }
          }
        }
      }
    }
    return options;
  }
}

export default ol3Echarts
