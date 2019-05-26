// @ts-ignore
import { Map, Object } from 'ol';
// @ts-ignore
import { transform } from 'ol/proj';
// @ts-ignore
import echarts from 'echarts';

import { merge, isObject, arrayAdd, bind, uuid, bindAll } from './helper';
import formatGeoJSON from './coordinate/formatGeoJSON';
import * as charts from './charts/index';

const _options = {
  forcedRerender: false, // Force re-rendering
  forcedPrecomposeRerender: false, // force pre re-render
  hideOnZooming: false, // when zooming hide chart
  hideOnMoving: false, // when moving hide chart
  hideOnRotating: false, // // when Rotating hide chart
  convertTypes: ['pie', 'line', 'bar'],
};

interface ConstructorParameters {
  chartOptions?: object;
  options: object;
  map?: any;
}

class EChartsLayer extends Object {
  static formatGeoJSON = formatGeoJSON;
  private _chartOptions: object | undefined | null;
  private $chart: null | any;
  private _isRegistered: boolean;
  private _incremental: any[];
  private _coordinateSystem: null | any;
  private coordinateSystemId: string;
  private _options: object | undefined | null;

  public _map: any;
  constructor ({ chartOptions, options, map }: ConstructorParameters) {
    super(options);

    /**
     * layer options
     */
    this._options = merge(_options, options);

    /**
     * chart options
     */
    this._chartOptions = chartOptions;

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
     * coordinateSystemId
     */
    this.coordinateSystemId = '';

    bindAll([
      'reRender', 'onResize', 'onZoomEnd', 'onCenterChange',
      'onDragRotateEnd', 'onMoveStart', 'onMoveEnd'
    ], this);

    if (map) this.appendTo(map);
  }

  /**
   * append layer to map
   * @param map
   */
  appendTo (map: any) {
    if (map && map instanceof Map) {
      this.setMap(map);
    } else {
      throw new Error('not map object');
    }
  }

  /**
   * get echarts options
   */
  getChartOptions (): object | undefined | null {
    return this._chartOptions;
  }

  /**
   * set echarts options and reRender
   * @param options
   * @returns {EChartsLayer}
   */
  setChartOptions (options: undefined | null | object = {}) {
    this._chartOptions = options;
    this.clearAndRedraw();
    return this;
  }

  /**
   * append data
   * @param data
   * @param save
   * @returns {EChartsLayer}
   */
  appendData (data: any, save: boolean | undefined | null = true) {
    if (data) {
      if (save) {
        this._incremental = arrayAdd(this._incremental, {
          data: data.data,
          seriesIndex: data.seriesIndex,
        });
      }
      // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/copyWithin
      this.$chart.appendData({
        data: data.data.copyWithin(),
        seriesIndex: data.seriesIndex,
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
   * remove layer
   */
  remove () {
    this.$chart.clear();
    this.$chart.dispose();
    this._incremental = [];
    delete this.$chart;
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
   * render
   */
  render () {
    console.log('11');
    if (!this.$chart) {
      // @ts-ignore
      this.$chart = echarts.init(this.element);
      if (this._chartOptions) {
        this.registerMap();
        this.$chart.setOption(this.reConverData(this._chartOptions), false);
      }
    } else if (this.isVisible()) {
      // this.$chart.resize();
      this.clearAndRedraw();
    }
  }

  updateViewSize(size: number[]): void {
    super.updateViewSize(size);
    this.onResize();
  }

  onResize () {
    this.clearAndRedraw();
    this.dispatchEvent({
      type: 'change:size',
      source: this,
    });
  }

  /**
   * clear chart and redraw
   * @private
   */
  private clearAndRedraw () {
    if (!this.$chart || !this.isVisible()) {
      return;
    }
    this.dispatchEvent({
      type: 'redraw',
      source: this,
    });
    // @ts-ignore
    if (this.$options.forcedRerender) {
      this.$chart.clear();
    }
    this.$chart.resize();
    if (this._chartOptions) {
      this.registerMap();
      this.$chart.setOption(this.reConverData(this._chartOptions), false);
      if (this._incremental && this._incremental.length > 0) {
        for (let i = 0; i < this._incremental.length; i++) {
          this.appendData(this._incremental[i], false);
        }
      }
    }
  }

  /**
   * register map coordinate system
   * @private
   */
  private registerMap () {
    if (!this._isRegistered) {
      this.coordinateSystemId = `openlayers_${uuid()}`;
      echarts.registerCoordinateSystem(this.coordinateSystemId, this.getCoordinateSystem(this.$options));
      this._isRegistered = true;
    }
    // @ts-ignore
    const series = this._chartOptions && this._chartOptions.series;
    if (series && isObject(series)) {
      // @ts-ignore
      const convertTypes = this.$options && this.$options.convertTypes;
      for (let i = series.length - 1; i >= 0; i--) {
        if (!(convertTypes.indexOf(series[i]['type']) > -1)) {
          series[i]['coordinateSystem'] = this.coordinateSystemId;
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
  private reConverData (options: object) {
    const series = options['series'];
    if (series && series.length > 0) {
      if (!this._coordinateSystem) {
        const Rc = this.getCoordinateSystem(this.$options);
        // @ts-ignore
        this._coordinateSystem = new Rc(this.getMap());
      }
      if (series && isObject(series)) {
        const convertTypes = this.$options && this.$options.convertTypes;
        for (let i = series.length - 1; i >= 0; i--) {
          if (convertTypes.indexOf(series[i]['type']) > -1) {
            if (series[i] && series[i].hasOwnProperty('coordinates')) {
              series[i] = charts[series[i]['type']](options, series[i], this._coordinateSystem);
            }
          }
        }
      }
    }
    return options;
  }

  private getCoordinateSystem (options?: object) {
    const map = this.getMap();
    const coordinateSystemId = this.coordinateSystemId;

    const RegisterCoordinateSystem = function (map: any) {
      // @ts-ignore
      this.map = map;
      // @ts-ignore
      this._mapOffset = [0, 0];
      // @ts-ignore
      this.dimensions = ['lng', 'lat'];
      // @ts-ignore
      this.projCode = RegisterCoordinateSystem.getProjectionCode(this.map);
    };

    RegisterCoordinateSystem.dimensions = RegisterCoordinateSystem.prototype.dimensions || ['lng', 'lat'];

    /**
     * get zoom
     * @returns {number}
     */
    RegisterCoordinateSystem.prototype.getZoom = function (): number {
      return this.map.getView().getZoom();
    };

    /**
     * set zoom
     * @param zoom
     */
    RegisterCoordinateSystem.prototype.setZoom = function (zoom: number): void {
      return this.map.getView().setZoom(zoom);
    };

    RegisterCoordinateSystem.prototype.getViewRectAfterRoam = function () {
      return this.getViewRect().clone();
    };

    /**
     * 设置地图窗口的偏移
     * @param mapOffset
     */
    RegisterCoordinateSystem.prototype.setMapOffset = function (mapOffset: number[]): void {
      this._mapOffset = mapOffset;
    };

    /**
     * 跟据坐标转换成屏幕像素
     * @param data
     * @returns {}
     */
    RegisterCoordinateSystem.prototype.dataToPoint = function (data: []): number[] {
      let coords;
      if (data && Array.isArray(data) && data.length > 0) {
        coords = data.map((item: string | number): number => {
          let res: number = 0;
          if (typeof item === 'string') {
            res = Number(item);
          } else {
            res = item;
          }
          return res;
        });
      }
      const source = options && options['source'] || 'EPSG:4326';
      const destination = options && options['destination'] || this.projCode;
      const pixel = this.map.getPixelFromCoordinate(transform(coords, source, destination));
      const mapOffset = this._mapOffset;
      return [pixel[0] - mapOffset[0], pixel[1] - mapOffset[1]];
    };

    /**
     * 跟据屏幕像素转换成坐标
     * @param pixel
     * @returns {}
     */
    RegisterCoordinateSystem.prototype.pointToData = function (pixel: number[]): number[] {
      const mapOffset: number[] = this._mapOffset;
      return this.map.getCoordinateFromPixel([pixel[0] + mapOffset[0], pixel[1] + mapOffset[1]]);
    };

    /**
     * 获取视图矩形范围
     * @returns {*}
     */
    RegisterCoordinateSystem.prototype.getViewRect = function () {
      const size = this.map.getSize();
      return new echarts.graphic.BoundingRect(0, 0, size[0], size[1]);
    };

    /**
     * create matrix
     */
    RegisterCoordinateSystem.prototype.getRoamTransform = function () {
      return echarts.matrix.create();
    };

    /**
     * 处理自定义图表类型
     * @returns {{coordSys: {type: string, x, y, width, height}, api: {coord, size}}}
     */
    RegisterCoordinateSystem.prototype.prepareCustoms = function () {
      const rect = this.getViewRect();
      return {
        coordSys: {
          // The name exposed to user is always 'cartesian2d' but not 'grid'.
          type: coordinateSystemId,
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        },
        api: {
          coord: bind(this.dataToPoint, this),
          size: bind(RegisterCoordinateSystem.dataToCoordsSize, this),
        },
      };
    };

    RegisterCoordinateSystem.create = function (echartModel: any) {
      echartModel.eachSeries((seriesModel: any) => {
        if (seriesModel.get('coordinateSystem') === coordinateSystemId) {
          // @ts-ignore
          seriesModel.coordinateSystem = new RegisterCoordinateSystem(map);
        }
      });
    };

    RegisterCoordinateSystem.getProjectionCode = function (map: any): string {
      let code: string = '';
      if (map) {
        code =
          map.getView() &&
          map
            .getView()
            .getProjection()
            .getCode();
      } else {
        code = 'EPSG:3857';
      }
      return code;
    };

    RegisterCoordinateSystem.dataToCoordsSize = function (dataSize: number[], dataItem: number[] = [0, 0]) {
      return echarts.util.map([0, 1], (dimIdx: number) => {
          const val = dataItem[dimIdx];
          const p1: number[] = [];
          const p2: number[] = [];
          const halfSize = dataSize[dimIdx] / 2;
          p1[dimIdx] = val - halfSize;
          p2[dimIdx] = val + halfSize;
          p1[1 - dimIdx] = p2[1 - dimIdx] = dataItem[1 - dimIdx];
          // @ts-ignore
          const offset: number = this.dataToPoint(p1)[dimIdx] - this.dataToPoint(p2)[dimIdx];
          return Math.abs(offset);
        },
        this,
      );
    };

    return RegisterCoordinateSystem;
  }
}

export default EChartsLayer;
