import type { ChartOptions, ChartSeriesOption, CoordinateSystemInstance } from '../types';
import { positionSeriesGrid } from './layout';
import type { ChartConverterContext } from './layout';

/**
 * Place line chart grids on the map using series `coordinates`.
 */
const line = function (
  options: ChartOptions,
  serie: ChartSeriesOption,
  coordinateSystem: CoordinateSystemInstance,
  context?: ChartConverterContext,
): ChartSeriesOption {
  positionSeriesGrid(options, serie, coordinateSystem, context);
  return serie;
};

export default line;
