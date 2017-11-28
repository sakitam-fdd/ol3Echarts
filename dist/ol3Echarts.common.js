/*!
 * ol3-echarts v1.3.0
 * LICENSE : MIT
 * (c) 2017-2017 https://sakitam-fdd.github.io/ol3Echarts
 */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var ol = _interopDefault(require('openlayers'));
var echarts = _interopDefault(require('echarts'));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var isObject = function isObject(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return value !== null && (type === 'object' || type === 'function');
};

var merge = function merge(a, b) {
  for (var key in b) {
    if (!a.hasOwnProperty(key)) {
      a[key] = b[key];
    } else if (isObject(b[key]) && isObject(a[key])) {
      merge(a[key], b[key]);
    }
  }
  return a;
};

var getTarget = function getTarget(selector) {
  var dom = function () {
    var found = void 0;
    return document && /^#([\w-]+)$/.test(selector) ? (found = document.getElementById(RegExp.$1)) ? [found] : [] : Array.prototype.slice.call(/^\.([\w-]+)$/.test(selector) ? document.getElementsByClassName(RegExp.$1) : /^[\w-]+$/.test(selector) ? document.getElementsByTagName(selector) : document.querySelectorAll(selector));
  }();
  return dom;
};

var _getCoordinateSystem = function _getCoordinateSystem(map, options) {
  var RegisterCoordinateSystem = function RegisterCoordinateSystem() {
    this.$options = options;
    this.$Map = map;
    this._mapOffset = [0, 0];
    this.dimensions = ['lng', 'lat'];
    this.projCode_ = this._getProjectionCode();
  };

  RegisterCoordinateSystem.prototype.setMapOffset = function (mapOffset) {
    this._mapOffset = mapOffset;
  };

  RegisterCoordinateSystem.prototype.dataToPoint = function (coords) {
    if (coords && Array.isArray(coords) && coords.length > 0) {
      coords = coords.map(function (item) {
        if (typeof item === 'string') {
          item = Number(item);
        }
        return item;
      });
    }
    var source = this.$options['source'] || 'EPSG:4326';
    var destination = this.$options['destination'] || this.projCode_;
    return this.$Map.getPixelFromCoordinate(ol.proj.transform(coords, source, destination));
  };

  RegisterCoordinateSystem.prototype._getProjectionCode = function () {
    var code = '';
    if (this.$Map) {
      code = this.$Map.getView() && this.$Map.getView().getProjection().getCode();
    } else {
      code = 'EPSG:3857';
    }
    return code;
  };

  RegisterCoordinateSystem.prototype.pointToData = function (pixel) {
    return this.$Map.getCoordinateFromPixel(pixel);
  };

  RegisterCoordinateSystem.prototype.getViewRect = function () {
    var size = this.$Map.getSize();
    return new echarts.graphic.BoundingRect(0, 0, size[0], size[1]);
  };

  RegisterCoordinateSystem.prototype.getRoamTransform = function () {
    return echarts.matrix.create();
  };

  RegisterCoordinateSystem.dimensions = ['lng', 'lat'];

  RegisterCoordinateSystem.getDimensionsInfo = function () {
    return RegisterCoordinateSystem.dimensions;
  };

  RegisterCoordinateSystem.create = function (echartModel) {
    var that = this;
    echartModel.eachSeries(function (seriesModel) {
      if (seriesModel.get('coordinateSystem') === 'openlayers') {
        seriesModel.coordinateSystem = new RegisterCoordinateSystem(that.$Map);
      }
    });
  };

  return RegisterCoordinateSystem;
};

var _options = {
  'hideOnZooming': false,
  'hideOnMoving': false,
  'hideOnRotating': false
};

var ol3Echarts = function () {
  function ol3Echarts(chartOptions) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, ol3Echarts);

    this.$options = Object.assign({}, _options, options);

    this.$chartOptions = chartOptions;

    this.$chart = null;

    this.$Map = null;

    this._isRegistered = false;
  }

  ol3Echarts.prototype.appendTo = function appendTo(map) {
    if (map && map instanceof ol.Map) {
      this.$Map = map;
      this.render();
      this._unRegisterEvents();
      this._registerEvents();
    } else {
      throw new Error('not map object');
    }
  };

  ol3Echarts.prototype.getChartOptions = function getChartOptions() {
    return this.$chartOptions;
  };

  ol3Echarts.prototype.setChartOptions = function setChartOptions() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.$chartOptions = options;
    this._clearAndRedraw();
    return this;
  };

  ol3Echarts.prototype.getMap = function getMap() {
    return this.$Map;
  };

  ol3Echarts.prototype._isVisible = function _isVisible() {
    return this.$container && this.$container.style.display === '';
  };

  ol3Echarts.prototype.show = function show() {
    if (this.$container) {
      this.$container.style.display = '';
    }
  };

  ol3Echarts.prototype.hide = function hide() {
    if (this.$container) {
      this.$container.style.display = 'none';
    }
  };

  ol3Echarts.prototype.remove = function remove() {
    this.$chart.clear();
    this.$chart.dispose();
    this._unRegisterEvents();
    delete this.$chart;
    delete this.$Map;
    this.$container.parentNode.removeChild(this.$container);
  };

  ol3Echarts.prototype.clear = function clear() {
    this.$chart.clear();
  };

  ol3Echarts.prototype._createLayerContainer = function _createLayerContainer(map, options) {
    var container = this.$container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = 0;
    container.style.left = 0;
    container.style.right = 0;
    container.style.buttom = 0;
    var _target = getTarget(options['target']);
    if (_target && _target[0] && _target[0] instanceof Element) {
      _target[0].appendChild(container);
    } else {
      map.getViewport().appendChild(container);
    }
  };

  ol3Echarts.prototype._resizeContainer = function _resizeContainer() {
    var size = this.getMap().getSize();
    this.$container.style.height = size[1] + 'px';
    this.$container.style.width = size[0] + 'px';
  };

  ol3Echarts.prototype._clearAndRedraw = function _clearAndRedraw() {
    if (this.$container && this.$container.style.display === 'none') {
      return;
    }
    this.$chart.clear();
    this.$chart.resize();
    if (this.$chartOptions) {
      this._registerMap();
      this.$chart.setOption(this.$chartOptions, false);
    }
  };

  ol3Echarts.prototype.onResize = function onResize() {
    this._resizeContainer();
    this._clearAndRedraw();
  };

  ol3Echarts.prototype.onZoomEnd = function onZoomEnd() {
    this.show();
    this._clearAndRedraw();
  };

  ol3Echarts.prototype.onDragRotateEnd = function onDragRotateEnd() {
    this.show();
    this._clearAndRedraw();
  };

  ol3Echarts.prototype.onMoveStart = function onMoveStart() {
    if (!this.$options['hideOnMoving']) {
      return;
    }
    this.hide();
  };

  ol3Echarts.prototype.onMoveEnd = function onMoveEnd() {
    this.show();
    this._clearAndRedraw();
  };

  ol3Echarts.prototype._registerEvents = function _registerEvents() {
    var Map = this.$Map;
    var view = Map.getView();
    Map.on('change:size', this.onResize, this);
    view.on('change:resolution', this.onZoomEnd, this);
    view.on('change:center', this.onMoveEnd, this);
    view.on('change:rotation', this.onDragRotateEnd, this);
    Map.on('movestart', this.onMoveStart, this);
    Map.on('moveend', this.onMoveEnd, this);
  };

  ol3Echarts.prototype._unRegisterEvents = function _unRegisterEvents() {
    var Map = this.$Map;
    var view = Map.getView();
    Map.un('change:size', this.onResize, this);
    view.un('change:resolution', this.onZoomEnd, this);
    view.un('change:center', this.onMoveEnd, this);
    view.un('change:rotation', this.onDragRotateEnd, this);
    Map.un('movestart', this.onMoveStart, this);
    Map.un('moveend', this.onMoveEnd, this);
  };

  ol3Echarts.prototype._registerMap = function _registerMap() {
    if (!this._isRegistered) {
      echarts.registerCoordinateSystem('openlayers', _getCoordinateSystem(this.getMap(), this.$options));
      this._isRegistered = true;
    }
    var series = this.$chartOptions.series;
    if (series) {
      for (var i = series.length - 1; i >= 0; i--) {
        series[i]['coordinateSystem'] = 'openlayers';
        series[i]['animation'] = false;
      }
    }
  };

  ol3Echarts.prototype.render = function render() {
    if (!this.$container) {
      this._createLayerContainer(this.$Map, this.$options);
      this._resizeContainer();
    }
    if (!this.$chart) {
      this.$chart = echarts.init(this.$container);
      if (this.$chartOptions) {
        this._registerMap();
        this.$chart.setOption(this.$chartOptions, false);
      }
    } else if (this._isVisible()) {
      this.$chart.resize();
    }
  };

  return ol3Echarts;
}();

ol3Echarts.getTarget = getTarget;
ol3Echarts.merge = merge;

module.exports = ol3Echarts;
