(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("echarts"));
	else if(typeof define === 'function' && define.amd)
		define(["echarts"], factory);
	else if(typeof exports === 'object')
		exports["EchartsComponent"] = factory(require("echarts"));
	else
		root["EchartsComponent"] = factory(root["echarts"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var echarts = __webpack_require__(0)
/**
 * 创建独立对象
 * @param map
 */
var EchartsComponent = function (map) {
  this.map = map
  var size = this.map.getSize()
  var div = document.createElement('div')
  div.style.position = 'absolute'
  div.style.height = size[1] + 'px'
  div.style.width = size[0] + 'px'
  div.style.top = 0
  div.style.left = 0
  this.map.getViewport().appendChild(div)
  this._echartsContainer = div
  this.chart = echarts.init(div)
  if (!echarts) {
    throw new Error('请先引入echarts3！')
  }
  echarts.Map = map
  this.resize()
}
/**
 * 移除echarts
 */
EchartsComponent.prototype.remove = function () {
  this._echartsContainer.parentNode.removeChild(this._echartsContainer)
  this.map = undefined
  echarts.Map = undefined
}
/**
 * 响应地图尺寸变化
 */
EchartsComponent.prototype.resize = function () {
  var that = this
  var size = this.map.getSize()
  that._echartsContainer.style.width = size[0] + 'px'
  that._echartsContainer.style.height = size[1] + 'px'
  window.onresize = function () {
    that.chart.resize()
  }
}

module.exports = EchartsComponent


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Created by FDD on 2017/5/30.
 * @desc 注册当前地图的坐标系统,事件，模块和视图
 */
!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {
  __webpack_require__(0).registerCoordinateSystem(
    'HMap', __webpack_require__(4)
  )
  __webpack_require__(5)
  __webpack_require__(6)
  __webpack_require__(0).registerAction({
    type: 'MapRoam',
    event: 'MapRoam',
    update: 'updateLayout'
  }, function (payload, ecModel) {})
  return {
    version: '1.2.0'
  }
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(2)
var EchartsComponent = __webpack_require__(1)
module.exports = EchartsComponent


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Created by FDD on 2017/5/30.
 * @desc 坐标系统
 */
!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {
  var echarts = __webpack_require__(0)
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
    return this.Map.getPixelFromCoordinate(coords)
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
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {
  return __webpack_require__(0).extendComponentModel({
    type: 'HMap',
    getBMap: function () {
      return this.Map
    },
    defaultOption: {
      roam: false
    }
  })
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {
  var echarts = __webpack_require__(0)
  return echarts.extendComponentView({
    type: 'HMap',
    render: function (MapModel, echartModel, api) {
      var rendering = true
      var Map = echarts.Map
      var viewportRoot = api.getZr().painter.getViewportRoot()
      var coordSys = MapModel.coordinateSystem
      var moveHandler = function (type, target) {
        if (rendering) {
          return
        }
        var offsetEl = viewportRoot.parentNode.parentNode.parentNode
        var mapOffset = [
          -parseInt(offsetEl.style.left, 10) || 0,
          -parseInt(offsetEl.style.top, 10) || 0
        ]
        viewportRoot.style.left = mapOffset[0] + 'px'
        viewportRoot.style.top = mapOffset[1] + 'px'
        coordSys.setMapOffset(mapOffset)
        MapModel.mapOffset = mapOffset
        api.dispatchAction({
          type: 'MapRoam'
        })
      }
      var zoomEndHandler = function () {
        if (rendering) {
          return
        }
        api.dispatchAction({
          type: 'MapRoam'
        })
      }
      this._oldMoveHandler = moveHandler
      this._oldZoomEndHandler = zoomEndHandler
      Map.getView().on('change:resolution', moveHandler)
      Map.getView().on('change:center', moveHandler)
      Map.getView().on('change:rotation', moveHandler)
      Map.on('moveend', moveHandler)
      var roam = MapModel.get('roam')
      if (roam && roam !== 'scale') {
        // todo 允许拖拽
      } else {
        // todo 不允许拖拽
      }
      if (roam && roam !== 'move') {
        // todo 允许移动
      } else {
        // todo 不允许允许移动
      }
      rendering = false
    }
  })
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))


/***/ })
/******/ ]);
});