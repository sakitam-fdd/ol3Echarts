import { isObject } from '../helper'

const bar = function (options, serie, coordinateSystem) {
  if (isObject(options.grid)) {
  } else if (Array.isArray(options.grid)) {
    options.grid = options.grid.map(function (gri, index) {
      let coorPixel = coordinateSystem.dataToPoint(serie.coordinates)
      gri.left = coorPixel[0]
      gri.top = coorPixel[1]
      return gri
    })
  }
}

export default bar
