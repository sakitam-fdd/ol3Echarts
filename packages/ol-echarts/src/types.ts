import type { Map } from 'ol';
import type { ProjectionLike } from 'ol/proj';
import type { Coordinate } from 'ol/coordinate';
import type { ECharts, EChartsCoreOption } from 'echarts';

/** Nullable helper */
export type Nullable<T> = T | null;

/** Optional / possibly undefined helper */
export type NoDef<T> = T | undefined;

/** Chart series types that need geographic → pixel conversion via `coordinates` */
export type ConvertChartType = 'pie' | 'line' | 'bar';

/**
 * Layer runtime options.
 * Controls projection, overlay placement, redraw strategy and event polyfill.
 */
export interface EChartsLayerOptions {
  /** Data source projection, default `EPSG:4326` */
  source?: ProjectionLike;
  /** Target projection; defaults to the map view projection */
  destination?: ProjectionLike;
  /** Call `echarts.clear()` before each redraw (costly) */
  forcedRerender?: boolean;
  /**
   * Redraw on every map frame via `prerender` (keeps sync, more paints).
   * Option name kept for backward compatibility; OpenLayers 6+ uses `prerender`
   * instead of the removed `precompose` event.
   */
  forcedPrecomposeRerender?: boolean;
  /** Hide chart while zooming */
  hideOnZooming?: boolean;
  /** Hide chart while panning */
  hideOnMoving?: boolean;
  /** Hide chart while rotating */
  hideOnRotating?: boolean;
  /**
   * Suppress pie labels and label lines while their geographic anchor is
   * outside the map viewport. Prevents extremely long offscreen guide lines.
   * @default true
   */
  hideOffscreenLabels?: boolean;
  /**
   * Series types converted by geographic `coordinates` field
   * instead of the registered OpenLayers coordinate system.
   */
  convertTypes?: Array<ConvertChartType | string>;
  /** Insert container as the first child of the overlay root */
  insertFirst?: boolean;
  /** Use `ol-overlaycontainer-stopevent` instead of `ol-overlaycontainer` */
  stopEvent?: boolean;
  /**
   * Proxy pointer events from the map to zrender.
   * Auto-enabled for OpenLayers &lt;= 6.1.1; usually unnecessary on OL 7+.
   */
  polyfillEvents?: boolean;
  [key: string]: unknown;
}

/** ECharts option accepted by the layer (standard option + optional series.coordinates) */
export type ChartOptions = EChartsCoreOption & {
  series?: ChartSeriesOption | ChartSeriesOption[];
};

/** Series option extended with map `coordinates` used by pie/bar/line converters */
export type ChartSeriesOption = Record<string, unknown> & {
  type?: string;
  coordinates?: Coordinate | number[];
  coordinateSystem?: string;
  animation?: boolean;
  center?: number[] | string[];
  radius?: number | string | Array<number | string>;
  label?: Record<string, unknown>;
  labelLine?: Record<string, unknown>;
  xAxisIndex?: number;
  yAxisIndex?: number;
  data?: unknown;
};

/** Incremental append payload for `appendData` */
export interface IncrementalDataItem {
  data: unknown[] | ArrayLike<unknown>;
  seriesIndex: number;
}

/** Internal incremental cache entry */
export interface IncrementalCacheItem extends IncrementalDataItem {
  index: number;
}

/** Coordinate system instance used by chart converters */
export interface CoordinateSystemInstance {
  dataToPoint(data: number[]): number[];
  pointToData?(pixel: number[]): number[];
  containPoint?(point: number[]): boolean;
  getViewRect?(): { x: number; y: number; width: number; height: number };
  prepareCustoms?(): unknown;
}

/** Layer events dispatched through ol/Object */
export type EChartsLayerEventType =
  | 'load'
  | 'redraw'
  | 'change:size'
  | 'zoomstart'
  | 'zoomend'
  | 'change:rotation'
  | 'movestart'
  | 'moveend'
  | 'change:center';

export interface EChartsLayerEvent {
  type: EChartsLayerEventType | string;
  source: unknown;
  value?: unknown;
}

export type { Map, ProjectionLike, Coordinate, ECharts, EChartsCoreOption };
