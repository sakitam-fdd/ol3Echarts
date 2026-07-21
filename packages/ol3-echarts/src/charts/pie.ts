const pie = function (
  _options: any,
  serie: { center: any; coordinates: number[]; label?: any; labelLine?: any },
  coordinateSystem: { dataToPoint: (arg0: any) => any; containPoint?: (point: number[]) => boolean },
  context: { hideOffscreenLabels?: boolean } = {},
) {
  serie.center = coordinateSystem.dataToPoint(serie.coordinates);
  if (context.hideOffscreenLabels !== false && coordinateSystem.containPoint?.(serie.center) === false) {
    serie.label = { ...(serie.label || {}), show: false };
    serie.labelLine = { ...(serie.labelLine || {}), show: false };
  }
  return serie;
};

export default pie;
