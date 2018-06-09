import { isObject } from '../helper';

const bar = function (options, serie, coordinateSystem) {
  if (isObject(options.grid) && !Array.isArray(options.grid)) {
    console.log(options);
  } else if (Array.isArray(options.grid)) {
    options.grid = options.grid.map(function (gri, index) {
      let coorPixel = coordinateSystem.dataToPoint(options.series[index].coordinates);
      gri.left = coorPixel[0] - parseFloat(gri.width) / 2;
      gri.top = coorPixel[1] - parseFloat(gri.height) / 2;
      return gri
    })
  }
  return serie;
};

export default bar;
