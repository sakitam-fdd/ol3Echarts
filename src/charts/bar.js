const bar = function (options, serie, coordinateSystem) {
  options.grid = options.grid.map(function (gri, index) {
    let coorPixel = coordinateSystem.dataToPoint(serie.coordinates)
    gri.left = coorPixel[0]
    gri.top = coorPixel[1]
    return gri
  })
}

export default bar
