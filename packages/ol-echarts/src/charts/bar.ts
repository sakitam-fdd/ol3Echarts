import type { ChartOptions, ChartSeriesOption, CoordinateSystemInstance } from '../types';
import { positionSeriesGrid } from './layout';
import type { ChartConverterContext } from './layout';

/**
 * Place bar chart grids on the map using series `coordinates`.
 */
const bar = function (
  options: ChartOptions,
  serie: ChartSeriesOption,
  coordinateSystem: CoordinateSystemInstance,
  context?: ChartConverterContext,
): ChartSeriesOption {
  positionSeriesGrid(options, serie, coordinateSystem, context);
  return serie;
};

export default bar;
