/**
 * Created by FDD on 2017/5/30.
 * @desc 坐标系统
 */
define(function (require) {
  var echarts = require('echarts')
  var CoordSys = function (mapInstance, api) {
    this.Map = mapInstance
    this.dimensions = ['lng', 'lat']
    this._mapOffset = [0, 0]
    this._api = api
  }

  CoordSys.prototype.dimensions = ['lng', 'lat']

  /**
   * 设置地图窗口的偏移
   * @param mapOffset
   */
  CoordSys.prototype.setMapOffset = function (mapOffset) {
    this._mapOffset = mapOffset
  }

  /**
   * 获取地图对象
   * @returns {*|ol.Map}
   */
  CoordSys.prototype.getBMap = function () {
    return this.Map
  }

  /**
   * 设置当前地图
   * @param map
   */
  CoordSys.prototype.setMap = function (map) {
    if (map && map instanceof ol.Map) {
      this.Map = map
    } else {
      throw new Error('传入的不是地图对象！')
    }
  }

  /**
   * 跟据坐标转换成屏幕像素
   * @param coords
   * @returns {ol.Pixel}
   */
  CoordSys.prototype.dataToPoint = function (coords) {
    if (coords && Array.isArray(coords) && coords.length > 0) {
      coords = coords.map(function (item) {
        if (typeof item === 'string') {
          item = Number(item)
        }
        return item
      })
    }
    return this.Map.getPixelFromCoordinate(ol.proj.fromLonLat(coords))
  }

  /**
   * 跟据屏幕像素转换成坐标
   * @param pixel
   * @returns {ol.Coordinate}
   */
  CoordSys.prototype.pointToData = function (pixel) {
    return this.Map.getCoordinateFromPixel(pixel)
  }

  /**
   * 获取视图矩形范围
   * @returns {*}
   */
  CoordSys.prototype.getViewRect = function () {
    var api = this._api
    return new echarts.graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight())
  }

  /**
   * 移动转换
   */
  CoordSys.prototype.getRoamTransform = function () {
    return echarts.matrix.create()
  }

  CoordSys.dimensions = CoordSys.prototype.dimensions

  /**
   * 注册实例
   * @param echartModel
   * @param api
   */
  CoordSys.create = function (echartModel, api) {
    var _coordSys = null
    echartModel.eachComponent('HMap', function (MapModel) {
      var _HMap = echarts.Map
      _coordSys = new CoordSys(_HMap, api)
      _coordSys.setMapOffset(MapModel.mapOffset || [0, 0])
      MapModel.coordinateSystem = _coordSys
    })

    echartModel.eachSeries(function (seriesModel) {
      if (seriesModel.get('coordinateSystem') === 'HMap') {
        seriesModel.coordinateSystem = _coordSys
      }
    })
  }

  return CoordSys
})
