import { Map, Object as OlObject } from 'ol';
import { VERSION } from 'ol/util';
import type { ProjectionLike } from 'ol/proj';
import { transform } from 'ol/proj';
import type Event from 'ol/events/Event';
import type { Coordinate } from 'ol/coordinate';
import * as echarts from 'echarts';
import type { ECharts } from 'echarts';
import Transformable from 'zrender/lib/core/Transformable';
import BoundingRect from 'zrender/lib/core/BoundingRect';

import { isObject, merge, arrayAdd, bind, uuid, bindAll, removeNode, mockEvent, semver, clone } from './utils';

import formatGeoJSON from './utils/formatGeoJSON';

import * as charts from './charts/index';

import type {
  ChartOptions,
  ChartSeriesOption,
  CoordinateSystemInstance,
  EChartsLayerOptions,
  IncrementalCacheItem,
  IncrementalDataItem,
  Nullable,
  NoDef,
} from './types';

export type {
  ChartOptions,
  ChartSeriesOption,
  ConvertChartType,
  CoordinateSystemInstance,
  EChartsLayerEvent,
  EChartsLayerEventType,
  EChartsLayerOptions,
  IncrementalCacheItem,
  IncrementalDataItem,
  Nullable,
  NoDef,
} from './types';

interface CoordinateSystemCreator {
  new (map: Map): CoordinateSystemInstance;
  dimensions: string[];
  create: (echartsModel: unknown) => void;
  getProjectionCode: (map: Map) => string;
}

const DEFAULT_OPTIONS: EChartsLayerOptions = {
  forcedRerender: false,
  forcedPrecomposeRerender: false,
  hideOnZooming: false,
  hideOnMoving: false,
  hideOnRotating: false,
  hideOffscreenLabels: true,
  convertTypes: ['pie', 'line', 'bar'],
  insertFirst: false,
  stopEvent: false,
  // OL <= 6.1.1 needs pointer event polyfill for zrender hit testing
  polyfillEvents: semver(VERSION, '6.1.1') <= 0,
};

class EChartsLayer extends OlObject {
  public static formatGeoJSON = formatGeoJSON;

  public static bind = bind;

  public static merge = merge;

  public static uuid = uuid;

  public static bindAll = bindAll;

  public static arrayAdd = arrayAdd;

  public static removeNode = removeNode;

  public static isObject = isObject;

  public static clone = clone;

  /** Default layer options (immutable snapshot) */
  public static defaultOptions: Readonly<EChartsLayerOptions> = Object.freeze({ ...DEFAULT_OPTIONS });

  private _chartOptions: NoDef<Nullable<ChartOptions>>;

  private _isRegistered: boolean;

  private _incremental: IncrementalCacheItem[];

  private _coordinateSystem: Nullable<CoordinateSystemInstance>;

  private coordinateSystemId: string;

  private readonly _options: EChartsLayerOptions;

  private _initEvent: boolean;

  private prevVisibleState: string;

  /** User-facing visibility; temporary hideOn* must not override this */
  private _userVisible: boolean;

  /** True between map movestart and moveend */
  private _isInteracting: boolean;

  private _interactionZoom: number | undefined;

  private _interactionRotation: number | undefined;

  private _isZooming: boolean;

  private _isRotating: boolean;

  public $chart: Nullable<ECharts>;

  public $container: NoDef<HTMLElement>;

  public _map: NoDef<Map>;

  constructor(
    chartOptions?: NoDef<Nullable<ChartOptions>>,
    options?: NoDef<Nullable<EChartsLayerOptions>>,
    map?: NoDef<Map>,
  ) {
    const opts: EChartsLayerOptions = {
      ...DEFAULT_OPTIONS,
      ...(options || {}),
      // keep convertTypes as a fresh array so callers cannot mutate defaults
      convertTypes: options?.convertTypes ? [...options.convertTypes] : [...(DEFAULT_OPTIONS.convertTypes as string[])],
    };
    super(opts);

    this._options = opts;
    this._chartOptions = chartOptions ? clone(chartOptions) : chartOptions;
    this.set('chartOptions', this._chartOptions);

    this.$chart = null;
    this.$container = undefined;
    this._isRegistered = false;
    this._initEvent = false;
    this._incremental = [];
    this._coordinateSystem = null;
    this.coordinateSystemId = '';
    this.prevVisibleState = '';
    this._userVisible = true;
    this._isInteracting = false;
    this._interactionZoom = undefined;
    this._interactionRotation = undefined;
    this._isZooming = false;
    this._isRotating = false;

    bindAll(
      [
        'redraw',
        'onResize',
        'onZoomStart',
        'onZoomEnd',
        'onResolutionChange',
        'onCenterChange',
        'onDragRotateStart',
        'onDragRotateEnd',
        'onMoveStart',
        'onMoveEnd',
        'mouseDown',
        'mouseUp',
        'onClick',
        'mouseMove',
      ],
      this,
    );

    if (map) this.setMap(map);
  }

  /**
   * append layer to map
   * @param map
   * @param forceIgnore skip `instanceof Map` check (for wrapped map objects)
   */
  public appendTo(map: Map, forceIgnore = false) {
    this.setMap(map, forceIgnore);
  }

  /**
   * get ol map
   */
  public getMap(): NoDef<Map> {
    return this._map;
  }

  /**
   * get echarts instance
   */
  public getECharts(): Nullable<ECharts> {
    return this.$chart;
  }

  /**
   * get layer options
   */
  public getOptions(): EChartsLayerOptions {
    return clone(this._options);
  }

  /**
   * set map
   * @param map
   * @param forceIgnore skip `instanceof Map` check
   */
  public setMap(map: Map, forceIgnore = false) {
    if (!map || (!forceIgnore && !(map instanceof Map))) {
      throw new Error('not ol map object');
    }

    if (this._map === map && this.$container) return;

    const previousMap = this._map;
    if (previousMap && this._initEvent) this.unBindEvent(previousMap);
    if (this.$container) removeNode(this.$container);

    this._map = map;
    this._coordinateSystem = null;
    this._isRegistered = false;
    this.coordinateSystemId = '';

    map.once('postrender', () => {
      if (this._map === map) this.handleMapChanged();
    });
    map.renderSync();
  }

  /**
   * get echarts options
   */
  public getChartOptions(): NoDef<Nullable<ChartOptions>> {
    return this.get('chartOptions');
  }

  /**
   * set echarts options and redraw
   * @param options
   */
  public setChartOptions(options: ChartOptions = {}) {
    this._chartOptions = clone(options);
    this._incremental = [];
    this.set('chartOptions', this._chartOptions);
    this.clearAndRedraw();
    return this;
  }

  /**
   * append incremental series data
   * @param data
   * @param save keep in internal cache for redraw
   */
  public appendData(data: IncrementalDataItem, save: boolean | undefined | null = true) {
    if (data && this.$chart) {
      const payload = clone(data.data);
      if (save) {
        this._incremental = arrayAdd(this._incremental, {
          index: this._incremental.length,
          data: clone(payload),
          seriesIndex: data.seriesIndex,
        });
      }
      this.$chart.appendData({
        data: payload as number[],
        seriesIndex: data.seriesIndex,
      });
    }
    return this;
  }

  /**
   * clear layer
   */
  public clear(keep?: boolean) {
    if (!keep) {
      this._incremental = [];
    }
    if (this.$chart) {
      this.$chart.clear();
    }
  }

  /**
   * remove layer and release chart / DOM / listeners
   */
  public remove() {
    this.clear();
    if (this.$chart) {
      this.$chart.dispose();
    }

    if (this._initEvent) {
      this.unBindEvent();
    }
    if (this.$container) {
      removeNode(this.$container);
      this.$container = undefined;
    }

    this.$chart = null;
    this._map = undefined;
    this._isRegistered = false;
    this.coordinateSystemId = '';
    this._coordinateSystem = null;
    this._incremental = [];
    this._isInteracting = false;
    this._interactionZoom = undefined;
    this._interactionRotation = undefined;
    this._isZooming = false;
    this._isRotating = false;
  }

  /**
   * show layer
   */
  public show() {
    this.setVisible(true);
  }

  private innerShow() {
    if (!this._userVisible || !this.$container) return;
    this.$container.style.display = this.prevVisibleState || '';
    this.prevVisibleState = '';
  }

  /**
   * hide layer
   */
  public hide() {
    this.setVisible(false);
  }

  private innerHide() {
    if (this.$container && this.$container.style.display !== 'none') {
      this.prevVisibleState = this.$container.style.display;
      this.$container.style.display = 'none';
    }
  }

  /**
   * check layer is visible
   */
  public isVisible() {
    return Boolean(this.$container && this.$container.style.display !== 'none');
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
  public setZIndex(zIndex: string | number) {
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
    this._userVisible = visible;
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
      this.clear(true);
      this._chartOptions = {} as ChartOptions;
      this.clearAndRedraw();
    }
  }

  /**
   * render
   */
  public render() {
    if (!this.$chart && this.$container) {
      this.$chart = echarts.init(this.$container);
      if (this._chartOptions) {
        const option = clone(this._chartOptions);
        this.registerMap(option);
        this.$chart.setOption(this.convertData(option), false);
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
  public updateViewSize(size?: Array<number>): void {
    if (!this.$container || !size) return;
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
      const size = map.getSize();
      this.updateViewSize(size);
      this.clearAndRedraw();
      if (event) {
        // ignore events
        this.dispatchEvent({
          type: 'change:size',
          source: this,
          value: size,
        });
      }
    }
  }

  private onZoomStart() {
    if (this._isZooming) return;
    this._isZooming = true;
    this._options.hideOnZooming && this.innerHide();
    const map = this.getMap();
    if (map && map.getView()) {
      this.dispatchEvent({
        type: 'zoomstart',
        source: this,
        value: map.getView().getZoom(),
      });
    }
  }

  /**
   * handle zoom end events
   */
  private onZoomEnd() {
    if (!this._isZooming) return;
    this._isZooming = false;
    this._options.hideOnZooming && this.innerShow();
    const map = this.getMap();
    if (map && map.getView()) {
      this.dispatchEvent({
        type: 'zoomend',
        source: this,
        value: map.getView().getZoom(),
      });
    }
  }

  /** Track resolution changes independently from MapBrowserEvent frame state. */
  private onResolutionChange() {
    if (this._isInteracting) {
      this.onZoomStart();
      return;
    }
    this.clearAndRedraw();
  }

  /**
   * handle rotate start (from movestart when rotation is changing)
   */
  private onDragRotateStart() {
    if (this._isRotating) return;
    this._isRotating = true;
    this._options.hideOnRotating && this.innerHide();
  }

  /**
   * handle rotate / rotation property changes
   */
  private onDragRotateEnd() {
    // change:rotation fires throughout an interaction; finish only at moveend.
    if (this._isInteracting) {
      this.onDragRotateStart();
      return;
    }
    this._isRotating = false;
    this._options.hideOnRotating && this.innerShow();
    const map = this.getMap();
    if (map && map.getView()) {
      if (!this._isInteracting) this.clearAndRedraw();
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
  private onMoveStart(e: { frameState?: { viewState?: { zoom?: number; rotation?: number } } }) {
    const map = this.getMap();

    if (!map || !map.getView()) {
      return;
    }

    this._isInteracting = true;

    const previousZoom = e?.frameState?.viewState?.zoom;
    const previousRotation = e?.frameState?.viewState?.rotation;
    const currentZoom = map.getView().getZoom();
    const currentRotation = map.getView().getRotation();

    this._interactionZoom = previousZoom ?? currentZoom;
    this._interactionRotation = previousRotation ?? currentRotation;

    if (previousZoom !== undefined && previousZoom !== currentZoom) {
      this.onZoomStart();
    }

    if (previousRotation !== undefined && previousRotation !== currentRotation) {
      this.onDragRotateStart();
    }

    this._options.hideOnMoving && this.innerHide();

    this.dispatchEvent({
      type: 'movestart',
      source: this,
      value: map.getView().getCenter(),
    });
  }

  /**
   * handle move end events
   */
  private onMoveEnd(e: { frameState?: { viewState?: { zoom?: number; rotation?: number } } }) {
    const map = this.getMap();

    if (!map || !map.getView()) {
      this._isInteracting = false;
      return;
    }

    const previousZoom = this._interactionZoom ?? e?.frameState?.viewState?.zoom;
    const previousRotation = this._interactionRotation ?? e?.frameState?.viewState?.rotation;
    const currentZoom = map.getView().getZoom();
    const currentRotation = map.getView().getRotation();
    const zoomChanged = this._isZooming || (previousZoom !== undefined && previousZoom !== currentZoom);
    const rotationChanged =
      this._isRotating || (previousRotation !== undefined && previousRotation !== currentRotation);

    this._isInteracting = false;
    this._options.hideOnMoving && this.innerShow();
    if (zoomChanged) this.onZoomEnd();
    if (rotationChanged) this.onDragRotateEnd();

    this.clearAndRedraw();
    this.dispatchEvent({
      type: 'moveend',
      source: this,
      value: map.getView().getCenter(),
    });
    this._interactionZoom = undefined;
    this._interactionRotation = undefined;
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
        container.insertBefore(this.$container!, container.childNodes[0] || null);
      } else {
        container.appendChild(this.$container!);
      }

      this.updateViewSize(map.getSize());
      // Bind before render so `load` handlers can interact with map events immediately
      this.bindEvent(map);
      this.render();
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
    this.$container.style.pointerEvents = 'auto';
  }

  /**
   * register events
   * @private
   */
  private bindEvent(map: Map) {
    if (this._initEvent) return;
    // https://github.com/openlayers/openlayers/issues/7284
    // OL event typings are strict across major versions; cast keeps runtime behavior stable.
    const m = map as Map & {
      on: (type: string, listener: (...args: any[]) => void) => void;
      un: (type: string, listener: (...args: any[]) => void) => void;
    };
    const view = map.getView() as ReturnType<Map['getView']> & {
      on: (type: string, listener: (...args: any[]) => void) => void;
      un: (type: string, listener: (...args: any[]) => void) => void;
    };
    if (this._options.forcedPrecomposeRerender) {
      // OL 6+ replaced precompose with prerender on Map
      m.on('prerender', this.redraw);
    }
    m.on('change:size', this.onResize);
    view.on('change:center', this.onCenterChange);
    view.on('change:resolution', this.onResolutionChange);
    view.on('change:rotation', this.onDragRotateEnd);
    m.on('movestart', this.onMoveStart);
    m.on('moveend', this.onMoveEnd);
    if (this._options.polyfillEvents) {
      m.on('pointerdown', this.mouseDown);
      m.on('pointerup', this.mouseUp);
      m.on('pointermove', this.mouseMove);
      m.on('click', this.onClick);
    }
    this._initEvent = true;
  }

  /**
   * un register events
   * @private
   */
  private unBindEvent(map: NoDef<Map> = this.getMap()) {
    if (!map) return;
    const view = map.getView();
    if (!view) return;
    const m = map as Map & {
      on: (type: string, listener: (...args: any[]) => void) => void;
      un: (type: string, listener: (...args: any[]) => void) => void;
    };
    const v = view as ReturnType<Map['getView']> & {
      on: (type: string, listener: (...args: any[]) => void) => void;
      un: (type: string, listener: (...args: any[]) => void) => void;
    };
    m.un('prerender', this.redraw);
    m.un('precompose', this.redraw);
    m.un('change:size', this.onResize);
    v.un('change:center', this.onCenterChange);
    v.un('change:resolution', this.onResolutionChange);
    v.un('change:rotation', this.onDragRotateEnd);
    m.un('movestart', this.onMoveStart);
    m.un('moveend', this.onMoveEnd);
    if (this._options.polyfillEvents) {
      m.un('pointerdown', this.mouseDown);
      m.un('pointerup', this.mouseUp);
      m.un('pointermove', this.mouseMove);
      m.un('click', this.onClick);
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
      const option = clone(this._chartOptions);
      this.registerMap(option);
      this.$chart.setOption(this.convertData(option), false);
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
   * register map coordinate system and stamp series
   * @private
   */
  private registerMap(chartOptions?: ChartOptions) {
    if (!this._isRegistered) {
      this.coordinateSystemId = `openlayers_${uuid()}`;
      // ECharts CoordinateSystemCreator typing is incomplete for custom systems
      echarts.registerCoordinateSystem(
        this.coordinateSystemId,
        this.getCoordinateSystem(this._options) as unknown as Parameters<typeof echarts.registerCoordinateSystem>[1],
      );
      this._isRegistered = true;
    }

    const target = chartOptions || this._chartOptions;
    if (target) {
      const series = target.series ? (Array.isArray(target.series) ? target.series : [target.series]) : [];
      const convertTypes = this._options.convertTypes || [];
      for (let i = series.length - 1; i >= 0; i--) {
        const item = series[i] as ChartSeriesOption;
        const isConverted = convertTypes.includes(item.type as string) && item.coordinates !== undefined;
        if (!isConverted && item.coordinateSystem == null) {
          item.coordinateSystem = this.coordinateSystemId;
        }
        if (item.animation === undefined) item.animation = false;
      }
    }
  }

  /**
   * Convert series that use geographic `coordinates` (pie / bar / line grids)
   */
  private convertData(options: ChartOptions): ChartOptions {
    const originalSeries = options.series;
    const series = originalSeries ? (Array.isArray(originalSeries) ? originalSeries : [originalSeries]) : [];
    if (series.length > 0) {
      const map = this.getMap();
      if (!map) return options;

      if (!this._coordinateSystem) {
        const Rc = this.getCoordinateSystem(this._options);
        this._coordinateSystem = new Rc(map);
      }
      const convertTypes = this._options.convertTypes || [];
      for (let i = series.length - 1; i >= 0; i--) {
        const item = series[i] as ChartSeriesOption;
        const { type } = item;
        if (type && convertTypes.indexOf(type) > -1 && Object.prototype.hasOwnProperty.call(item, 'coordinates')) {
          const converter = (charts as unknown as Record<string, Function>)[type];
          if (typeof converter === 'function') {
            series[i] = converter(options, item, this._coordinateSystem, {
              hideOffscreenLabels: this._options.hideOffscreenLabels,
              seriesIndex: i,
            });
          }
        }
      }
      if (!Array.isArray(originalSeries)) options.series = series[0];
    }
    return options;
  }

  /**
   * register coordinateSystem
   * @param options
   */
  private getCoordinateSystem(options?: EChartsLayerOptions): CoordinateSystemCreator {
    const map = this.getMap() as Map;
    const coordinateSystemId = this.coordinateSystemId;

    class RegisterCoordinateSystem implements CoordinateSystemInstance {
      map: Map;

      _mapOffset = [0, 0];

      dimensions = ['lng', 'lat'];

      projCode: string;

      static dimensions = RegisterCoordinateSystem.prototype.dimensions || ['lng', 'lat'];

      static create = function (echartsModel: { eachSeries: (cb: (seriesModel: any) => void) => void }) {
        echartsModel.eachSeries((seriesModel: any) => {
          if (seriesModel.get('coordinateSystem') === coordinateSystemId) {
            seriesModel.coordinateSystem = new RegisterCoordinateSystem(map);
          }
        });
      };

      static getProjectionCode = function (m: Map): string {
        if (m) {
          const view = m.getView();
          return (view && view.getProjection() && view.getProjection().getCode()) || 'EPSG:3857';
        }
        return 'EPSG:3857';
      };

      /**
       * Represents the transform brought by roam/zoom.
       * If `View['_viewRect']` applies roam transform,
       * we can get the final displayed rect.
       */
      private _roamTransformable = new Transformable();

      /**
       * Represents the transform from `View['_rect']` to `View['_viewRect']`.
       */
      protected _rawTransformable = new Transformable();

      private _viewRect: BoundingRect | undefined;

      constructor(m: Map) {
        this.map = m;
        this.dimensions = ['lng', 'lat'];
        this.projCode = RegisterCoordinateSystem.getProjectionCode(this.map);
      }

      /**
       * get zoom
       */
      getZoom(): number {
        return this.map.getView().getZoom() as number;
      }

      /**
       * set zoom
       * @param zoom
       */
      setZoom(zoom: number): void {
        this.map.getView().setZoom(zoom);
      }

      getViewRectAfterRoam() {
        return this.getViewRect().clone();
      }

      /**
       * 设置地图窗口的偏移
       * @param mapOffset
       */
      setMapOffset(mapOffset: number[]): void {
        this._mapOffset = mapOffset;
      }

      /**
       * Convert geographic data to screen pixels
       */
      dataToPoint(data: number[]): number[] {
        if (!(data && Array.isArray(data) && data.length > 0)) {
          return [0, 0];
        }

        const coords = data.map((item: string | number): number =>
          typeof item === 'string' ? Number(item) : item,
        ) as Coordinate;

        const source: ProjectionLike = (options && options.source) || 'EPSG:4326';
        const destination: ProjectionLike = (options && options.destination) || this.projCode;
        const projected = transform(coords, source, destination);
        const pixel = this.map.getPixelFromCoordinate(projected);
        if (!pixel) {
          return [0, 0];
        }
        const mapOffset = this._mapOffset;
        return [pixel[0] - mapOffset[0], pixel[1] - mapOffset[1]];
      }

      /**
       * Convert screen pixels to map coordinates
       */
      pointToData(pixel: number[]): number[] {
        const mapOffset: number[] = this._mapOffset;
        const projected = this.map.getCoordinateFromPixel([pixel[0] + mapOffset[0], pixel[1] + mapOffset[1]]);
        if (!projected) return [0, 0];
        const source: ProjectionLike = (options && options.source) || 'EPSG:4326';
        const destination: ProjectionLike = (options && options.destination) || this.projCode;
        return transform(projected, destination, source);
      }

      containPoint(point: number[]): boolean {
        const rect = this.getViewRect();
        return (
          Number.isFinite(point[0]) &&
          Number.isFinite(point[1]) &&
          point[0] >= rect.x &&
          point[0] <= rect.x + rect.width &&
          point[1] >= rect.y &&
          point[1] <= rect.y + rect.height
        );
      }

      setViewRect(): void {
        const size = this.map.getSize() || [0, 0];
        this._viewRect = new BoundingRect(0, 0, size[0], size[1]);
      }

      /**
       * 获取视图矩形范围
       * @returns {*}
       */
      getViewRect() {
        const size = this.map.getSize() || [0, 0];
        if (!this._viewRect || this._viewRect.width !== size[0] || this._viewRect.height !== size[1]) {
          this.setViewRect();
        }
        return this._viewRect!;
      }

      /**
       * create matrix
       */
      getRoamTransform() {
        return this._roamTransformable.getLocalTransform();
      }

      /**
       * 处理自定义图表类型
       * @returns {{coordSys: {type: string, x, y, width, height}, api: {coord, size}}}
       */
      prepareCustoms() {
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
            size: bind(this.dataToCoordsSize, this),
          },
        };
      }

      dataToCoordsSize(dataSize: number[], dataItem: number[] = [0, 0]) {
        return [0, 1].map((dimIdx: number) => {
          const val = dataItem[dimIdx];
          const p1: number[] = [];
          const p2: number[] = [];
          const halfSize = dataSize[dimIdx] / 2;
          p1[dimIdx] = val - halfSize;
          p2[dimIdx] = val + halfSize;
          p1[1 - dimIdx] = dataItem[1 - dimIdx];
          p2[1 - dimIdx] = dataItem[1 - dimIdx];
          const offset: number = this.dataToPoint(p1)[dimIdx] - this.dataToPoint(p2)[dimIdx];
          return Math.abs(offset);
        });
      }

      getTransformInfo() {
        const rawTransformable = this._rawTransformable;

        const roamTransformable = this._roamTransformable;
        // Becuase roamTransformabel has `originX/originY` modified,
        // but the caller of `getTransformInfo` can not handle `originX/originY`,
        // so need to recalcualte them.
        const dummyTransformable = new Transformable();
        dummyTransformable.transform = roamTransformable.transform;
        dummyTransformable.decomposeTransform();

        return {
          roam: {
            x: dummyTransformable.x,
            y: dummyTransformable.y,
            scaleX: dummyTransformable.scaleX,
            scaleY: dummyTransformable.scaleY,
          },
          raw: {
            x: rawTransformable.x,
            y: rawTransformable.y,
            scaleX: rawTransformable.scaleX,
            scaleY: rawTransformable.scaleY,
          },
        };
      }
    }

    return RegisterCoordinateSystem as unknown as CoordinateSystemCreator;
  }

  /**
   * dispatch event
   * @param event
   */
  public dispatchEvent(event: object | Event | string) {
    return super.dispatchEvent(event as Event);
  }

  public set(key: string, value: any, optSilent?: boolean) {
    return super.set(key, value, optSilent);
  }

  public get(key: string) {
    return super.get(key);
  }
}

export default EChartsLayer;
