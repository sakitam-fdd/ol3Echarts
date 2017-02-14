(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("echarts"));
	else if(typeof define === 'function' && define.amd)
		define(["echarts"], factory);
	else if(typeof exports === 'object')
		exports["ol3Echarts"] = factory(require("echarts"));
	else
		root["ol3Echarts"] = factory(root["echarts"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

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

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

/**
 * 创建独立对象
 * @param map
 */
function ol3Echarts (map) {
  this._map = map;
  var size = this._map.getSize();
  var div = this._echartsContainer = document.createElement('div');
  div.style.position = 'absolute';
  div.style.height = size[1] + 'px';
  div.style.width = size[0] + 'px';
  div.style.top = 0;
  div.style.left = 0;
  this._map.getViewport().appendChild(div);
  this.chart = echarts.init(this._echartsContainer)
  if (!echarts) {
    throw new Error('请先引入echarts3！')
  }
  echarts.olMap = map
  this.resize()
}
/**
 * 移除echarts
 */
ol3Echarts.prototype.remove = function () {
  this._echartsContainer.parentNode.removeChild(this._echartsContainer)
  this._map = undefined
}
/**
 * 响应地图尺寸变化
 */
ol3Echarts.prototype.resize = function () {
  var that = this
  window.onresize = function () {
    that._echartsContainer.style.width = that._map.getSize() + 'px'
    that._echartsContainer.style.height = that._map.getSize() + 'px'
    that.chart.resize()
  }
}

module.exports = ol3Echarts;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/**
 * olMap component extension
 */
!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {
  __webpack_require__(0).registerCoordinateSystem(
    'olMap', __webpack_require__(3)
  )
  __webpack_require__(4)
  __webpack_require__(5)

  // Action
  __webpack_require__(0).registerAction({
    type: 'olMapRoam',
    event: 'olMapRoam',
    update: 'updateLayout'
  }, function (payload, ecModel) {})

  return {
    version: '1.0.0'
  }
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))




/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {
  var echarts = __webpack_require__(0)
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
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {
  return __webpack_require__(0).extendComponentModel({
    type: 'olMap',
    getBMap: function () {
      // __bmap is injected when creating BMapCoordSys
      return this.__olMap;
    },
    defaultOption: {
      roam: false
    }
  });
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {
  return __webpack_require__(0).extendComponentView({
    type: 'olMap',

    render: function (olMapModel, ecModel, api) {
      var rendering = true

      var olMap = echarts.olMap
      var viewportRoot = api.getZr().painter.getViewportRoot()
      var coordSys = olMapModel.coordinateSystem
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
        olMapModel.__mapOffset = mapOffset

        api.dispatchAction({
          type: 'olMapRoam'
        })
      }

      function zoomEndHandler () {
        if (rendering) {
          return
        }
        api.dispatchAction({
          type: 'olMapRoam'
        })
      }

      // olMap.off('move', this._oldMoveHandler)
      // // FIXME
      // // Moveend may be triggered by centerAndZoom method when creating coordSys next time
      // // olMap.removeEventListener('moveend', this._oldMoveHandler)
      // olMap.off('zoomend', this._oldZoomEndHandler)
      // olMap.on('move', moveHandler)
      // // olMap.addEventListener('moveend', moveHandler)
      // olMap.on('zoomend', zoomEndHandler)
      olMap.getView().on('change:resolution', moveHandler);
      olMap.getView().on('change:center', moveHandler);
      olMap.on('moveend', moveHandler);

      this._oldMoveHandler = moveHandler
      this._oldZoomEndHandler = zoomEndHandler

      var roam = olMapModel.get('roam')
      if (roam && roam !== 'scale') {
        // todo 允许拖拽
      }else {
        // todo 不允许拖拽
      }
      if (roam && roam !== 'move') {
        // todo 允许移动
      }else {
        // todo 不允许允许移动
      }
      rendering = false
    }
  })
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(2)
var ol3Echarts = __webpack_require__(1)
module.exports = ol3Echarts;

/***/ })
/******/ ]);
});