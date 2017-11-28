/**
 * Created by FDD on 2017/5/30.
 * @desc 坐标系统
 */

import echarts from 'echarts'
import ol from 'openlayers'

const _getCoordinateSystem = function (map, options) {
  const RegisterCoordinateSystem = function () {
    this.$options = options
    this.$Map = map
    this._mapOffset = [0, 0]
    this.dimensions = ['lng', 'lat']
    this.projCode_ = this._getProjectionCode()
  }

  RegisterCoordinateSystem.prototype.dimensions = ['lng', 'lat']

  RegisterCoordinateSystem.dimensions = RegisterCoordinateSystem.prototype.dimensions

  /**
   * 设置地图窗口的偏移
   * @param mapOffset
   */
  RegisterCoordinateSystem.prototype.setMapOffset = function (mapOffset) {
    this._mapOffset = mapOffset
  }

  /**
   * 跟据坐标转换成屏幕像素
   * @param coords
   * @returns {ol.Pixel}
   */
  RegisterCoordinateSystem.prototype.dataToPoint = function (coords) {
    if (coords && Array.isArray(coords) && coords.length > 0) {
      coords = coords.map(function (item) {
        if (typeof item === 'string') {
          item = Number(item)
        }
        return item
      })
    }
    let source = this.$options['source'] || 'EPSG:4326'
    let destination = this.$options['destination'] || this.projCode_
    return this.$Map.getPixelFromCoordinate(ol.proj.transform(coords, source, destination))
  }

  /**
   * 获取地图视图投影
   * @returns {string}
   * @private
   */
  RegisterCoordinateSystem.prototype._getProjectionCode = function () {
    let code = ''
    if (this.$Map) {
      code = this.$Map.getView() && this.$Map.getView().getProjection().getCode()
    } else {
      code = 'EPSG:3857'
    }
    return code
  }

  /**
   * 跟据屏幕像素转换成坐标
   * @param pixel
   * @returns {ol.Coordinate}
   */
  RegisterCoordinateSystem.prototype.pointToData = function (pixel) {
    return this.$Map.getCoordinateFromPixel(pixel)
  }

  /**
   * 获取视图矩形范围
   * @returns {*}
   */
  RegisterCoordinateSystem.prototype.getViewRect = function () {
    const size = this.$Map.getSize()
    return new echarts.graphic.BoundingRect(0, 0, size[0], size[1])
  }

  /**
   * 移动转换
   */
  RegisterCoordinateSystem.prototype.getRoamTransform = function () {
    return echarts.matrix.create()
  }

  /**
   * get dimensions info
   * @returns {Array|[string,string]}
   */
  RegisterCoordinateSystem.getDimensionsInfo = function () {
    return RegisterCoordinateSystem.dimensions
  }

  /**
   * 注册实例
   * @param echartModel
   */
  RegisterCoordinateSystem.create = function (echartModel) {
    const that = this
    echartModel.eachSeries(function (seriesModel) {
      if (seriesModel.get('coordinateSystem') === 'openlayers') {
        seriesModel.coordinateSystem = new RegisterCoordinateSystem(that.$Map)
      }
    })
  }

  return RegisterCoordinateSystem
}

export default _getCoordinateSystem
