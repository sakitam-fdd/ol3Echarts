import type { ChartOptions, ChartSeriesOption, CoordinateSystemInstance } from '../types';
import type { ChartConverterContext } from './layout';

/**
 * Convert pie series geographic `coordinates` into ECharts `center` pixel position.
 */
const pie = function (
  _options: ChartOptions,
  serie: ChartSeriesOption,
  coordinateSystem: CoordinateSystemInstance,
  context: ChartConverterContext = {},
): ChartSeriesOption {
  if (serie.coordinates) {
    const center = coordinateSystem.dataToPoint(serie.coordinates as number[]);
    serie.center = center;

    // ECharts may lay out a pie labelLine all the way from an offscreen center
    // to a visible label. Suppress only labels; canvas clipping still handles
    // the pie graphic itself and partially visible pies remain rendered.
    if (context.hideOffscreenLabels !== false && coordinateSystem.containPoint?.(center) === false) {
      serie.label = { ...(serie.label || {}), show: false };
      serie.labelLine = { ...(serie.labelLine || {}), show: false };
    }
  }
  return serie;
};

export default pie;
