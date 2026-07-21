import type { ChartOptions, ChartSeriesOption, CoordinateSystemInstance } from '../types';

export interface ChartConverterContext {
  hideOffscreenLabels?: boolean;
  seriesIndex?: number;
}

export interface GridItem {
  id?: string;
  left?: number | string;
  top?: number | string;
  width?: number | string;
  height?: number | string;
  [key: string]: unknown;
}

function toPixels(value: number | string | undefined, total: number): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value !== 'string') return 0;
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return 0;
  return value.trim().endsWith('%') ? (parsed / 100) * total : parsed;
}

function getSeries(options: ChartOptions): ChartSeriesOption[] {
  if (!options.series) return [];
  return Array.isArray(options.series) ? options.series : [options.series];
}

function getAxisGridIndex(options: ChartOptions, serie: ChartSeriesOption, fallback: number): number {
  const axisIndex = Number(serie.xAxisIndex ?? serie.yAxisIndex ?? fallback);
  const axes = (serie.xAxisIndex !== undefined ? options.xAxis : options.yAxis) as
    Array<{ gridIndex?: number }> | { gridIndex?: number } | undefined;
  const axis = Array.isArray(axes) ? axes[axisIndex] : axes;
  return Number(axis?.gridIndex ?? axisIndex);
}

/** Position the grid used by one coordinate-anchored cartesian series. */
export function positionSeriesGrid(
  options: ChartOptions,
  serie: ChartSeriesOption,
  coordinateSystem: CoordinateSystemInstance,
  context: ChartConverterContext = {},
): void {
  const coordinates = serie.coordinates as number[] | undefined;
  const grid = options.grid as GridItem | GridItem[] | undefined;
  if (!coordinates || !grid) return;

  const series = getSeries(options);
  const seriesIndex = context.seriesIndex ?? series.indexOf(serie);
  const gridIndex = getAxisGridIndex(options, serie, Math.max(seriesIndex, 0));
  const gridItem = Array.isArray(grid) ? grid[gridIndex] : grid;
  if (!gridItem) return;

  const point = coordinateSystem.dataToPoint(coordinates);
  const view = coordinateSystem.getViewRect?.();
  const width = toPixels(gridItem.width, view?.width ?? 0);
  const height = toPixels(gridItem.height, view?.height ?? 0);
  gridItem.left = point[0] - width / 2;
  gridItem.top = point[1] - height / 2;
}
