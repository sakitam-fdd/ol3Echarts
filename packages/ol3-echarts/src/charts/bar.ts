import { isObject } from '../utils';

const bar = function (
  options: {
    grid: { map: (arg0: (gri: any, index: any) => any) => void } | any;
    series: { [x: string]: { coordinates: number[] } };
  },
  serie: any,
  coordinateSystem: { dataToPoint: (arg0: any) => any },
) {
  if (Array.isArray(options.grid)) {
    options.grid = options.grid.map((gri: any, index: number) => {
      const coorPixel: number[] = coordinateSystem.dataToPoint(options.series[index].coordinates);
      gri.left = coorPixel[0] - parseFloat(gri.width) / 2;
      gri.top = coorPixel[1] - parseFloat(gri.height) / 2;
      return gri;
    });
  } else if (isObject(options.grid)) {
    // Single grid object: leave untouched
  }
  return serie;
};

export default bar;
