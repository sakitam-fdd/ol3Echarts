const pie = function (options, serie, coordinateSystem) {
  serie.center = coordinateSystem.dataToPoint(serie.coordinates)
}

export default pie
