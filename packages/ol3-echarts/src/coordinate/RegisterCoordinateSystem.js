/**
 * Created by FDD on 2017/5/30.
 * @desc 坐标系统
 */

import echarts from 'echarts';
import ol from 'openlayers';
import { map as $map, bind } from '../helper';

const _getCoordinateSystem = function (map, options = {}) {
  const RegisterCoordinateSystem = function () {
    this._mapOffset = [0, 0];
    this.dimensions = ['lng', 'lat'];
    this.projCode_ = this._getProjectionCode();
  };

  RegisterCoordinateSystem.prototype.dimensions = ['lng', 'lat'];

  RegisterCoordinateSystem.dimensions = RegisterCoordinateSystem.prototype.dimensions;

  /**
   * get zoom
   * @returns {number}
   */
  RegisterCoordinateSystem.prototype.getZoom = function () {
    return map.getView().getZoom();
  };

  /**
   * set zoom
   * @param zoom
   */
  RegisterCoordinateSystem.prototype.setZoom = function (zoom) {
    return map.getView().setZoom(zoom);
  };

  RegisterCoordinateSystem.prototype.getViewRectAfterRoam = function () {
    return this.getViewRect().clone();
  };

  /**
   * 设置地图窗口的偏移
   * @param mapOffset
   */
  RegisterCoordinateSystem.prototype.setMapOffset = function (mapOffset) {
    this._mapOffset = mapOffset;
  };

  /**
   * 跟据坐标转换成屏幕像素
   * @param coords
   * @returns {ol.Pixel}
   */
  RegisterCoordinateSystem.prototype.dataToPoint = function (coords) {
    if (coords && Array.isArray(coords) && coords.length > 0) {
      coords = coords.map(function (item) {
        if (typeof item === 'string') {
          item = Number(item);
        }
        return item;
      });
    }
    let source = options['source'] || 'EPSG:4326';
    let destination = options['destination'] || this.projCode_;
    let pixel = map.getPixelFromCoordinate(ol.proj.transform(coords, source, destination));
    const mapOffset = this._mapOffset;
    return [pixel[0] - mapOffset[0], pixel[1] - mapOffset[1]];
  };

  /**
   * 获取地图视图投影
   * @returns {string}
   * @private
   */
  RegisterCoordinateSystem.prototype._getProjectionCode = function () {
    let code = '';
    if (map) {
      code =
        map.getView() &&
        map
          .getView()
          .getProjection()
          .getCode();
    } else {
      code = 'EPSG:3857';
    }
    return code;
  };

  /**
   * 跟据屏幕像素转换成坐标
   * @param pixel
   * @returns {ol.Coordinate}
   */
  RegisterCoordinateSystem.prototype.pointToData = function (pixel) {
    const mapOffset = this._mapOffset;
    return map.getCoordinateFromPixel([pixel[0] + mapOffset[0], pixel[1] + mapOffset[1]]);
  };

  /**
   * 获取视图矩形范围
   * @returns {*}
   */
  RegisterCoordinateSystem.prototype.getViewRect = function () {
    const size = map.getSize();
    return new echarts.graphic.BoundingRect(0, 0, size[0], size[1]);
  };

  /**
   * 移动转换
   */
  RegisterCoordinateSystem.prototype.getRoamTransform = function () {
    return echarts.matrix.create();
  };

  /**
   * 处理自定义图表类型
   * @param data
   * @returns {{coordSys: {type: string, x, y, width, height}, api: {coord, size}}}
   */
  RegisterCoordinateSystem.prototype.prepareCustoms = function (data) {
    const rect = this.getViewRect();
    return {
      coordSys: {
        // The name exposed to user is always 'cartesian2d' but not 'grid'.
        type: 'openlayers',
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      },
      api: {
        coord: bind(this.dataToPoint, this),
        size: bind(RegisterCoordinateSystem.dataToCoordSize, this)
      }
    };
  };

  /**
   * math coord size
   * @param dataSize
   * @param dataItem
   */
  RegisterCoordinateSystem.dataToCoordSize = function (dataSize, dataItem) {
    dataItem = dataItem || [0, 0];
    return $map(
      [0, 1],
      function (dimIdx) {
        let val = dataItem[dimIdx];
        let halfSize = dataSize[dimIdx] / 2;
        let [p1, p2] = [[], []];
        p1[dimIdx] = val - halfSize;
        p2[dimIdx] = val + halfSize;
        p1[1 - dimIdx] = p2[1 - dimIdx] = dataItem[1 - dimIdx];
        return Math.abs(this.dataToPoint(p1)[dimIdx] - this.dataToPoint(p2)[dimIdx]);
      },
      this
    );
  };

  /**
   * 注册实例
   * @param echartModel
   */
  RegisterCoordinateSystem.create = function (echartModel, api) {
    echartModel.eachSeries(function (seriesModel) {
      if (seriesModel.get('coordinateSystem') === 'openlayers') {
        seriesModel.coordinateSystem = new RegisterCoordinateSystem(map);
      }
    });
  };

  return RegisterCoordinateSystem;
};

export default _getCoordinateSystem;
