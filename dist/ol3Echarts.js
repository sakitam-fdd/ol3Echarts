/*! this file creat by FDD */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("echarts"));
	else if(typeof define === 'function' && define.amd)
		define("ol3Echarts", ["echarts"], factory);
	else if(typeof exports === 'object')
		exports["ol3Echarts"] = factory(require("echarts"));
	else
		root["ol3Echarts"] = factory(root["echarts"]);
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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(2);
var ol3Echarts = __webpack_require__(6);
module.exports = ol3Echarts;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {
  __webpack_require__(0).registerCoordinateSystem('HMap', __webpack_require__(3));
  __webpack_require__(4);
  __webpack_require__(5);
  __webpack_require__(0).registerAction({
    type: 'MapRoam',
    event: 'MapRoam',
    update: 'updateLayout'
  }, function (payload, ecModel) {});
  return {
    version: '1.2.0'
  };
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {
  var echarts = __webpack_require__(0);
  var CoordSys = function CoordSys(mapInstance, api) {
    this.Map = mapInstance;
    this.dimensions = ['lng', 'lat'];
    this._mapOffset = [0, 0];
    this._api = api;
  };

  CoordSys.prototype.dimensions = ['lng', 'lat'];

  CoordSys.prototype.setMapOffset = function (mapOffset) {
    this._mapOffset = mapOffset;
  };

  CoordSys.prototype.getBMap = function () {
    return this.Map;
  };

  CoordSys.prototype.setMap = function (map) {
    if (map && map instanceof ol.Map) {
      this.Map = map;
    } else {
      throw new Error('传入的不是地图对象！');
    }
  };

  CoordSys.prototype.dataToPoint = function (coords) {
    if (coords && Array.isArray(coords) && coords.length > 0) {
      coords = coords.map(function (item) {
        if (typeof item === 'string') {
          item = Number(item);
        }
        return item;
      });
    }
    return this.Map.getPixelFromCoordinate(ol.proj.fromLonLat(coords));
  };

  CoordSys.prototype.pointToData = function (pixel) {
    return this.Map.getCoordinateFromPixel(pixel);
  };

  CoordSys.prototype.getViewRect = function () {
    var api = this._api;
    return new echarts.graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight());
  };

  CoordSys.prototype.getRoamTransform = function () {
    return echarts.matrix.create();
  };

  CoordSys.dimensions = CoordSys.prototype.dimensions;

  CoordSys.create = function (echartModel, api) {
    var _coordSys = null;
    echartModel.eachComponent('HMap', function (MapModel) {
      var _HMap = echarts.Map;
      _coordSys = new CoordSys(_HMap, api);
      _coordSys.setMapOffset(MapModel.mapOffset || [0, 0]);
      MapModel.coordinateSystem = _coordSys;
    });

    echartModel.eachSeries(function (seriesModel) {
      if (seriesModel.get('coordinateSystem') === 'HMap') {
        seriesModel.coordinateSystem = _coordSys;
      }
    });
  };

  return CoordSys;
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {
  return __webpack_require__(0).extendComponentModel({
    type: 'HMap',
    getBMap: function getBMap() {
      return this.Map;
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

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {
  var echarts = __webpack_require__(0);
  return echarts.extendComponentView({
    type: 'HMap',
    render: function render(MapModel, echartModel, api) {
      var rendering = true;
      var Map = echarts.Map;
      var viewportRoot = api.getZr().painter.getViewportRoot();
      var coordSys = MapModel.coordinateSystem;
      var moveHandler = function moveHandler(type, target) {
        if (rendering) {
          return;
        }
        var offsetEl = viewportRoot.parentNode.parentNode.parentNode;
        var mapOffset = [-parseInt(offsetEl.style.left, 10) || 0, -parseInt(offsetEl.style.top, 10) || 0];
        viewportRoot.style.left = mapOffset[0] + 'px';
        viewportRoot.style.top = mapOffset[1] + 'px';
        coordSys.setMapOffset(mapOffset);
        MapModel.mapOffset = mapOffset;
        api.dispatchAction({
          type: 'MapRoam'
        });
      };
      var zoomEndHandler = function zoomEndHandler() {
        if (rendering) {
          return;
        }
        api.dispatchAction({
          type: 'MapRoam'
        });
      };
      this._oldMoveHandler = moveHandler;
      this._oldZoomEndHandler = zoomEndHandler;
      Map.getView().on('change:resolution', moveHandler);
      Map.getView().on('change:center', moveHandler);
      Map.getView().on('change:rotation', moveHandler);
      Map.on('moveend', moveHandler);
      var roam = MapModel.get('roam');
      if (roam && roam !== 'scale') {} else {}
      if (roam && roam !== 'move') {} else {}
      rendering = false;
    }
  });
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var echarts = __webpack_require__(0);

var ol3Echarts = function ol3Echarts(map, container) {
  this.map = map;
  var size = this.map.getSize();
  var div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.height = size[1] + 'px';
  div.style.width = size[0] + 'px';
  div.style.top = 0;
  div.style.left = 0;
  if (container && container.indexOf('.') === 0) {
    var _container = this.getElementsByClassName(container, window);
    _container.appendChild(div);
  } else if (container && container.indexOf('#') === 0) {
    var _con = typeof container === 'string' ? document.getElementById(container) : container;
    _con.appendChild(div);
  } else {
    this.map.getViewport().appendChild(div);
  }
  this._echartsContainer = div;
  this.chart = echarts.init(div);
  if (!echarts) {
    throw new Error('请先引入echarts3！');
  }
  echarts.Map = map;
  this.resize();
};

ol3Echarts.prototype.getElementsByClassName = function (str, root) {
  var _root = root || window;
  var $ = _root.document.querySelector.bind(_root.document);
  var target = $(str);
  return target;
};

ol3Echarts.prototype.remove = function () {
  this._echartsContainer.parentNode.removeChild(this._echartsContainer);
  this.map = undefined;
  echarts.Map = undefined;
};

ol3Echarts.prototype.resize = function () {
  var that = this;
  var size = this.map.getSize();
  that._echartsContainer.style.width = size[0] + 'px';
  that._echartsContainer.style.height = size[1] + 'px';
  var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
  var doc = window.document;
  window.addEventListener(resizeEvt, function () {
    setTimeout(function () {
      that.chart.resize();
    }, 50);
  }, false);
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setTimeout(function () {
        that.chart.resize();
      }, 50);
    }
  }, false);
  if (doc.readyState === 'complete') {
    setTimeout(function () {
      that.chart.resize();
    }, 50);
  } else {
    doc.addEventListener('DOMContentLoaded', function (e) {
      setTimeout(function () {
        that.chart.resize();
      }, 50);
    }, false);
  }
};

module.exports = ol3Echarts;

/***/ })
/******/ ]);
});
//# sourceMappingURL=ol3Echarts.js.map