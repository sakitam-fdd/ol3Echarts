define(function (require) {
  var echarts = require('echarts')
  function olMapCoordSys (olMap, api) {
    this._olMap = olMap
    this.dimensions = ['lng', 'lat']
    this._mapOffset = [0, 0]
    this._api = api
  }

  olMapCoordSys.prototype.dimensions = ['lng', 'lat']

  olMapCoordSys.prototype.setMapOffset = function (mapOffset) {
    this._mapOffset = mapOffset
  }

  olMapCoordSys.prototype.getBMap = function () {
    return this._olMap
  }

  olMapCoordSys.prototype.dataToPoint = function (coords) {
    return this._olMap.getPixelFromCoordinate(ol.proj.fromLonLat(coords));
  }

  olMapCoordSys.prototype.pointToData = function (pixel) {
    return this._olMap.getCoordinateFromPixel(pixel);
  }

  olMapCoordSys.prototype.getViewRect = function () {
    var api = this._api
    return new echarts.graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight())
  }

  olMapCoordSys.prototype.getRoamTransform = function () {
    return echarts.matrix.create()
  }


  // For deciding which dimensions to use when creating list data
  olMapCoordSys.dimensions = olMapCoordSys.prototype.dimensions

  olMapCoordSys.create = function (ecModel, api) {
    var coordSys;
    ecModel.eachComponent('olMap', function (olMapModel) {
      var viewportRoot = api.getZr().painter.getViewportRoot()
      var olMap = echarts.olMap;
      coordSys = new olMapCoordSys(olMap, api)
      coordSys.setMapOffset(olMapModel.__mapOffset || [0, 0])
      olMapModel.coordinateSystem = coordSys
    })

    ecModel.eachSeries(function (seriesModel) {
      if (seriesModel.get('coordinateSystem') === 'olMap') {
        seriesModel.coordinateSystem = coordSys
      }
    })
  }
  return olMapCoordSys
})
