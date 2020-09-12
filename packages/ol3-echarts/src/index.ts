import ol, { GlobalObject } from 'openlayers';
import echarts from 'echarts';

import {
  isObject, merge,
  arrayAdd, bind,
  uuid, bindAll,
  removeNode,
  mockEvent,
} from './utils';
import formatGeoJSON from './utils/formatGeoJSON';

import * as charts from './charts/index';

const Map = ol.Map;
const obj = ol.Object;
const transform = ol.proj.transform;

// polyfill functions: should fix me
// @ts-ignore
if (!Map.prototype.getOverlayContainer) {
  // @ts-ignore
  Map.prototype.getOverlayContainer = function (className?: string) {
    className = className || 'ol-overlaycontainer';
    const viewport = this.getViewport();
    if (viewport) {
      const overlays = viewport.getElementsByClassName(className);
      return overlays && overlays.length > 0 ? overlays[0] : null;
    }
    return null;
  };
}

// polyfill functions: should fix me
// @ts-ignore
if (!Map.prototype.getOverlayContainerStopEvent) {
  // @ts-ignore
  Map.prototype.getOverlayContainerStopEvent = function (className?: string) {
    className = className || 'ol-overlaycontainer-stopevent';
    const viewport = this.getViewport();
    if (viewport) {
      const overlays = viewport.getElementsByClassName(className);
      return overlays && overlays.length > 0 ? overlays[0] : null;
    }
    return null;
  };
}

const _options = {
  forcedRerender: false, // Force re-rendering
  forcedPrecomposeRerender: false, // force pre re-render
  hideOnZooming: false, // when zooming hide chart
  hideOnMoving: false, // when moving hide chart
  hideOnRotating: false, // // when Rotating hide chart
  convertTypes: ['pie', 'line', 'bar'],
  insertFirst: false,
  stopEvent: false,
  polyfillEvents: false, // fix echarts mouse events
};

type Nullable<T> = T | null;
type NoDef<T> = T | undefined;

interface OptionsTypes {
  source?: ol.ProjectionLike;
  destination?: ol.ProjectionLike;
  forcedRerender?: boolean;
  forcedPrecomposeRerender?: boolean;
  hideOnZooming?: boolean;
  hideOnMoving?: boolean;
  hideOnRotating?: boolean;
  convertTypes?: string[] | number[];
  insertFirst?: boolean;
  stopEvent?: boolean;
  polyfillEvents?: boolean;
  [key: string]: any;
}

class EChartsLayer extends obj {
  public static formatGeoJSON = formatGeoJSON;

  public static bind = bind;

  public static merge = merge;

  public static uuid = uuid;

  public static bindAll = bindAll;

  public static arrayAdd = arrayAdd;

  public static removeNode = removeNode;

  public static isObject = isObject;

  private _chartOptions: NoDef<Nullable<object>>;

  private _isRegistered: boolean;

  private _incremental: any[];

  private _coordinateSystem: Nullable<any>;

  private coordinateSystemId: string;

  private readonly _options: OptionsTypes;

  private _initEvent: boolean;

  private prevVisibleState: string | null;

  public $chart: Nullable<any>;

  public $container: NoDef<HTMLElement>;

  public _map: any;

  constructor(chartOptions?: NoDef<Nullable<object>>, options?: NoDef<Nullable<OptionsTypes>>, map?: any) {
    const opts = Object.assign(_options, options);
    super(opts);

    /**
     * layer options
     */
    this._options = opts;

    /**
     * chart options
     */
    this._chartOptions = chartOptions;
    this.set('chartOptions', chartOptions); // cache chart Options

    /**
     * chart instance
     * @type {null}
     */
    this.$chart = null;

    /**
     * chart element
     * @type {undefined}
     */
    this.$container = undefined;

    /**
     * Whether the relevant configuration has been registered
     * @type {boolean}
     * @private
     */
    this._isRegistered = false;

    /**
     * check if init
     */
    this._initEvent = false;

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

    this.prevVisibleState = '';

    bindAll([
      'redraw', 'onResize', 'onZoomEnd', 'onCenterChange',
      'onDragRotateEnd', 'onMoveStart', 'onMoveEnd',
      'mouseDown', 'mouseUp', 'onClick', 'mouseMove',
    ], this);

    if (map) this.setMap(map);
  }

  /**
   * append layer to map
   * @param map
   */
  public appendTo(map: any) {
    this.setMap(map);
  }

  /**
   * get ol map
   * @returns {ol.Map}
   */
  public getMap() {
    return this._map;
  }

  /**
   * set map
   * @param map
   */
  public setMap(map: any) {
    if (map && map instanceof Map) {
      this._map = map;
      this._map.once('postrender', () => {
        this.handleMapChanged();
      });
      this._map.renderSync();
    } else {
      throw new Error('not ol map object');
    }
  }

  /**
   * get echarts options
   */
  public getChartOptions(): object | undefined | null {
    return this.get('chartOptions');
  }

  /**
   * set echarts options and redraw
   * @param options
   * @returns {EChartsLayer}
   */
  public setChartOptions(options: object = {}) {
    this._chartOptions = options;
    this.set('chartOptions', options);
    this.clearAndRedraw();
    return this;
  }

  /**
   * append data
   * @param data
   * @param save
   * @returns {EChartsLayer}
   */
  public appendData(data: any, save: boolean | undefined | null = true) {
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
  public clear() {
    this._incremental = [];
    if (this.$chart) {
      this.$chart.clear();
    }
  }

  /**
   * remove layer
   */
  public remove() {
    this.clear();
    if (this.$chart) {
      this.$chart.dispose();
    }

    if (this._initEvent && this.$container) {
      this.$container && removeNode(this.$container);
      this.unBindEvent();
    }
    delete this.$chart;
    delete this._map;
  }

  /**
   * show layer
   */
  public show() {
    this.setVisible(true);
  }

  private innerShow() {
    if (this.$container) {
      this.$container.style.display = this.prevVisibleState;
      this.prevVisibleState = '';
    }
  }

  /**
   * hide layer
   */
  public hide() {
    this.setVisible(false);
  }

  private innerHide() {
    if (this.$container) {
      this.prevVisibleState = this.$container.style.display;
      this.$container.style.display = 'none';
    }
  }

  /**
   * check layer is visible
   */
  public isVisible() {
    return this.$container && this.$container.style.display !== 'none';
  }

  /**
   * show loading bar
   */
  public showLoading() {
    if (this.$chart) {
      this.$chart.showLoading();
    }
  }

  /**
   * hide loading bar
   */
  public hideLoading() {
    if (this.$chart) {
      this.$chart.hideLoading();
    }
  }

  /**
   * set zindex
   * @param zIndex
   */
  public setZIndex(zIndex: string | number | null) {
    if (this.$container) {
      if (typeof zIndex === 'number') {
        zIndex = String(zIndex);
      }
      this.$container.style.zIndex = zIndex;
    }
  }

  /**
   * get zindex
   */
  public getZIndex() {
    return this.$container && this.$container.style.zIndex;
  }

  /**
   * set visible
   * from: https://github.com/sakitam-fdd/ol3Echarts/blob/3929ad72f562661ba3511d4d9e360dee5ac793c2/
   * packages/ol-echarts/src/index.js
   * author: https://github.com/ChenGuanglin0924
   * @param visible
   */
  public setVisible(visible: boolean) {
    if (visible) {
      if (this.$container) {
        this.$container.style.display = '';
      }
      this._chartOptions = this.getChartOptions();
      this.clearAndRedraw();
    } else {
      if (this.$container) {
        this.$container.style.display = 'none';
      }
      this.clear();
      this._chartOptions = {};
      this.clearAndRedraw();
    }
  }

  /**
   * render
   */
  public render() {
    if (!this.$chart && this.$container) {
      // @ts-ignore
      this.$chart = echarts.init(this.$container);
      if (this._chartOptions) {
        this.registerMap();
        this.$chart.setOption(this.convertData(this._chartOptions), false);
      }
      this.dispatchEvent({
        type: 'load',
        source: this,
        value: this.$chart,
      });
    } else if (this.isVisible()) {
      this.redraw();
    }
  }

  /**
   * redraw echarts layer
   */
  public redraw() {
    this.clearAndRedraw();
  }

  /**
   * update container size
   * @param size
   */
  public updateViewSize(size: number[]): void {
    if (!this.$container) return;
    this.$container.style.width = `${size[0]}px`;
    this.$container.style.height = `${size[1]}px`;
    this.$container.setAttribute('width', String(size[0]));
    this.$container.setAttribute('height', String(size[1]));
  }

  /**
   * handle map view resize
   */
  private onResize(event?: any) {
    const map = this.getMap();
    if (map) {
      const size: number[] = map.getSize();
      this.updateViewSize(size);
      this.clearAndRedraw();
      if (event) { // ignore events
        this.dispatchEvent({
          type: 'change:size',
          source: this,
          value: size,
        });
      }
    }
  }

  /**
   * handle zoom end events
   */
  private onZoomEnd() {
    this._options.hideOnZooming && this.innerShow();
    const map = this.getMap();
    if (map && map.getView()) {
      this.clearAndRedraw();
      this.dispatchEvent({
        type: 'zoomend',
        source: this,
        value: map.getView().getZoom(),
      });
    }
  }

  /**
   * handle rotate end events
   */
  private onDragRotateEnd() {
    this._options.hideOnRotating && this.innerShow();
    const map = this.getMap();
    if (map && map.getView()) {
      this.clearAndRedraw();
      this.dispatchEvent({
        type: 'change:rotation',
        source: this,
        value: map.getView().getRotation(),
      });
    }
  }

  /**
   * handle move start events
   */
  private onMoveStart() {
    this._options.hideOnMoving && this.innerHide();
    const map = this.getMap();
    if (map && map.getView()) {
      this.dispatchEvent({
        type: 'movestart',
        source: this,
        value: map.getView().getCenter(),
      });
    }
  }

  /**
   * handle move end events
   */
  private onMoveEnd() {
    this._options.hideOnMoving && this.innerShow();
    const map = this.getMap();
    if (map && map.getView()) {
      this.clearAndRedraw();
      this.dispatchEvent({
        type: 'moveend',
        source: this,
        value: map.getView().getCenter(),
      });
    }
  }

  /**
   * on mouse click
   * @param event
   */
  private onClick(event: any) {
    if (this.$chart) {
      this.$chart.getZr().painter.getViewportRoot().dispatchEvent(mockEvent('click', event));
    }
  }

  /**
   * on mouse down
   * @param event
   */
  private mouseDown(event: any) {
    if (this.$chart) {
      this.$chart.getZr().painter.getViewportRoot().dispatchEvent(mockEvent('mousedown', event));
    }
  }

  /**
   * mouse up
   * @param event
   */
  private mouseUp(event: any) {
    if (this.$chart) {
      this.$chart.getZr().painter.getViewportRoot().dispatchEvent(mockEvent('mouseup', event));
    }
  }

  /**
   * mousemove 事件需要分两种情况处理:
   * 1. ol-overlaycontainer-stopevent 有高度, 则 propagation path 是 ol-viewport -> ol-overlaycontainer-stopevent.
   * 此时 ol-overlaycontainer 无法获得事件, 只能 mock 处理
   * 2. ol-overlaycontainer-stopevent 没有高度, 则 propagation path 是 ol-viewport -> ol-overlaycontainer. 无需 mock
   * @param event
   */
  private mouseMove(event: any) {
    if (this.$chart) {
      let target = event.originalEvent.target;
      while (target) {
        if (target.className === 'ol-overlaycontainer-stopevent') {
          this.$chart.getZr().painter.getViewportRoot().dispatchEvent(mockEvent('mousemove', event));
          return;
        }
        target = target.parentElement;
      }
    }
  }

  /**
   * handle center change
   */
  private onCenterChange() {
    const map = this.getMap();
    if (map && map.getView()) {
      this.clearAndRedraw();
      this.dispatchEvent({
        type: 'change:center',
        source: this,
        value: map.getView().getCenter(),
      });
    }
  }

  /**
   * handle map change
   */
  private handleMapChanged() {
    const map = this.getMap();
    if (this._initEvent && this.$container) {
      this.$container && removeNode(this.$container);
      this.unBindEvent();
    }

    if (!this.$container) {
      this.createLayerContainer();
      this.onResize(false);
    }

    if (map) {
      const container = this._options.stopEvent ? map.getOverlayContainerStopEvent() : map.getOverlayContainer();
      if (this._options.insertFirst) {
        container.insertBefore(this.$container, container.childNodes[0] || null);
      } else {
        container.appendChild(this.$container);
      }

      this.render();
      this.bindEvent(map);
    }
  }

  /**
   * create container
   */
  private createLayerContainer() {
    this.$container = document.createElement('div');
    this.$container.style.position = 'absolute';
    this.$container.style.top = '0px';
    this.$container.style.left = '0px';
    this.$container.style.right = '0px';
    this.$container.style.bottom = '0px';
  }

  /**
   * register events
   * @private
   */
  private bindEvent(map: any) {
    // https://github.com/openlayers/openlayers/issues/7284
    const view = map.getView();
    if (this._options.forcedPrecomposeRerender) {
      map.on('precompose', this.redraw);
    }
    map.on('change:size', this.onResize);
    view.on('change:resolution', this.onZoomEnd);
    view.on('change:center', this.onCenterChange);
    view.on('change:rotation', this.onDragRotateEnd);
    map.on('movestart', this.onMoveStart);
    map.on('moveend', this.onMoveEnd);
    if (this._options.polyfillEvents) {
      map.on('pointerdown', this.mouseDown);
      map.on('pointerup', this.mouseUp);
      map.on('pointermove', this.mouseMove);
      map.on('click', this.onClick);
    }
    this._initEvent = true;
  }

  /**
   * un register events
   * @private
   */
  private unBindEvent() {
    const map = this.getMap();
    if (!map) return;
    const view = map.getView();
    if (!view) return;
    map.un('precompose', this.redraw);
    map.un('change:size', this.onResize);
    view.un('change:resolution', this.onZoomEnd);
    view.un('change:center', this.onCenterChange);
    view.un('change:rotation', this.onDragRotateEnd);
    map.un('movestart', this.onMoveStart);
    map.un('moveend', this.onMoveEnd);
    if (this._options.polyfillEvents) {
      map.un('pointerdown', this.mouseDown);
      map.un('pointerup', this.mouseUp);
      map.un('pointermove', this.mouseMove);
      map.un('click', this.onClick);
    }
    this._initEvent = false;
  }

  /**
   * clear chart and redraw
   * @private
   */
  private clearAndRedraw() {
    if (!this.$chart || !this.isVisible()) return;
    if (this._options.forcedRerender) {
      this.$chart.clear();
    }
    this.$chart.resize();
    if (this._chartOptions) {
      this.registerMap();
      this.$chart.setOption(this.convertData(this._chartOptions), false);
      if (this._incremental && this._incremental.length > 0) {
        for (let i = 0; i < this._incremental.length; i++) {
          this.appendData(this._incremental[i], false);
        }
      }
    }

    this.dispatchEvent({
      type: 'redraw',
      source: this,
    });
  }

  /**
   * register map coordinate system
   * @private
   */
  private registerMap() {
    if (!this._isRegistered) {
      this.coordinateSystemId = `openlayers_${uuid()}`;
      // @ts-ignore
      echarts.registerCoordinateSystem(this.coordinateSystemId, this.getCoordinateSystem(this._options));
      this._isRegistered = true;
    }

    if (this._chartOptions) {
      // @ts-ignore
      const series = this._chartOptions.series;
      if (series && isObject(series)) {
        const convertTypes = this._options.convertTypes;
        if (convertTypes) {
          for (let i = series.length - 1; i >= 0; i--) {
            if (!(convertTypes.indexOf(series[i].type) > -1)) {
              series[i].coordinateSystem = this.coordinateSystemId;
            }
            series[i].animation = false;
          }
        }
      }
    }
  }

  /**
   * 重新处理数据
   * @param options
   * @returns {*}
   */
  private convertData(options: object) {
    // @ts-ignore
    const series = options.series;
    if (series && series.length > 0) {
      if (!this._coordinateSystem) {
        const Rc = this.getCoordinateSystem(this._options);
        // @ts-ignore
        this._coordinateSystem = new Rc(this.getMap());
      }
      if (series && isObject(series)) {
        const convertTypes = this._options.convertTypes;
        if (convertTypes) {
          for (let i = series.length - 1; i >= 0; i--) {
            if (convertTypes.indexOf(series[i].type) > -1) {
              if (series[i] && series[i].hasOwnProperty('coordinates')) {
                // @ts-ignore
                series[i] = charts[series[i].type](options, series[i], this._coordinateSystem);
              }
            }
          }
        }
      }
    }
    return options;
  }

  /**
   * register coordinateSystem
   * @param options
   */
  private getCoordinateSystem(options?: OptionsTypes) {
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
      let coords: ol.Coordinate;
      if (data && Array.isArray(data) && data.length > 0) {
        // @ts-ignore
        coords = data.map((item: string | number) => {
          let res = 0;
          if (typeof item === 'string') {
            res = Number(item);
          } else {
            res = item;
          }
          return res;
        });

        const source: ol.ProjectionLike = (options && options.source) || 'EPSG:4326';
        const destination: ol.ProjectionLike = (options && options.destination) || this.projCode;
        const pixel = this.map.getPixelFromCoordinate(transform(coords, source, destination));
        const mapOffset = this._mapOffset;
        return [pixel[0] - mapOffset[0], pixel[1] - mapOffset[1]];
      }

      return [0, 0];
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
      // @ts-ignore
      return new echarts.graphic.BoundingRect(0, 0, size[0], size[1]);
    };

    /**
     * create matrix
     */
    RegisterCoordinateSystem.prototype.getRoamTransform = function () {
      // @ts-ignore
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

    RegisterCoordinateSystem.create = function (echartsModel: any) {
      echartsModel.eachSeries((seriesModel: any) => {
        if (seriesModel.get('coordinateSystem') === coordinateSystemId) {
          // @ts-ignore
          seriesModel.coordinateSystem = new RegisterCoordinateSystem(map);
        }
      });
    };

    RegisterCoordinateSystem.getProjectionCode = function (map: any): string {
      let code = '';
      if (map) {
        code = map.getView()
          && map
            .getView()
            .getProjection()
            .getCode();
      } else {
        code = 'EPSG:3857';
      }
      return code;
    };

    RegisterCoordinateSystem.dataToCoordsSize = function (dataSize: number[], dataItem: number[] = [0, 0]) {
      return [0, 1].map((dimIdx: number) => {
          const val = dataItem[dimIdx];
          const p1: number[] = [];
          const p2: number[] = [];
          const halfSize = dataSize[dimIdx] / 2;
          p1[dimIdx] = val - halfSize;
          p2[dimIdx] = val + halfSize;
          p1[1 - dimIdx] = dataItem[1 - dimIdx];
          p2[1 - dimIdx] = dataItem[1 - dimIdx];
          // @ts-ignore
          const offset: number = this.dataToPoint(p1)[dimIdx] - this.dataToPoint(p2)[dimIdx];
          return Math.abs(offset);
        },
        this);
    };

    return RegisterCoordinateSystem;
  }

  /**
   * dispatch event
   * @param event
   */
  public dispatchEvent(event: (GlobalObject| ol.events.Event | string)) {
    return super.dispatchEvent(event);
  }

  public set(key: string, value: any, optSilent?: boolean) {
    return super.set(key, value, optSilent);
  }

  public get(key: string) {
    return super.get(key);
  }

  public unset(key: string, optSilent?: boolean) {
    return super.unset(key, optSilent);
  }

  public on(type: (string | string[]), listener: ol.EventsListenerFunctionType, optThis?: GlobalObject) {
    return super.on(type, listener, optThis);
  }

  public un(type: (string | string[]), listener: ol.EventsListenerFunctionType, optThis?: GlobalObject) {
    return super.un(type, listener, optThis);
  }
}

export default EChartsLayer;
