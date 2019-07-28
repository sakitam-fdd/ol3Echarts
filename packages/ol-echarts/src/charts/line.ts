import { isObject } from '../utils';

const line = function (
  options: any,
  serie: any,
  coordinateSystem: any,
) {
  if (isObject(options.grid) && !Array.isArray(options.grid)) {
    console.log(options);
  } else if (Array.isArray(options.grid)) {
    options.grid = options.grid.map((gri: any, index: number) => {
      const coorPixel: number[] = coordinateSystem.dataToPoint(options.series[index].coordinates);
      gri.left = coorPixel[0] - parseFloat(gri.width) / 2;
      gri.top = coorPixel[1] - parseFloat(gri.height) / 2;
      return gri;
    });
  }
  return serie;
};

export default line;
