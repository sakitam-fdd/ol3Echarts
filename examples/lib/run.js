!function (t) {
  function e (i) {
    if (n[i])return n[i].exports;
    var o = n[i] = {exports: {}, id: i, loaded: !1};
    return t[i].call(o.exports, o, o.exports, e), o.loaded = !0, o.exports
  }

  var n = {};
  return e.m = t, e.c = n, e.p = "", e(0)
}([function (t, e, n) {
  t.exports = n(3)
}, , , function (module, exports) {
  function _clearTimeTickers () {
    for (var t = 0; t < _intervalIdList.length; t++)clearInterval(_intervalIdList[t]);
    for (var t = 0; t < _timeoutIdList.length; t++)clearTimeout(_timeoutIdList[t]);
    _intervalIdList = [], _timeoutIdList = []
  }

  function syncBackOption (t) {
    var e = t.getOption();
    if (_windowTopOrigin) {
      var n = {series: []};
      try {
        n = JSON.stringify(e)
      } catch (i) {
        console.error(i)
      }
      window.top.postMessage({action: "optionUpdated", computedOption: n}, _windowTopOrigin)
    }
  }

  function _wrapEChartsSetOption (t) {
    var e = t.setOption;
    t.setOption = function () {
      var n = e.apply(t, arguments);
      return clearTimeout(syncBackTimeout), syncBackTimeout = setTimeout(function () {
        syncBackOption(t)
      }, 2e3), n
    }
  }

  function _wrapOnMethods (t) {
    var e = t.on;
    t.on = function (n) {
      var i = e.apply(t, arguments);
      return _events.push(n), i
    }
  }

  function _clearChartEvents () {
    _events.forEach(function (t) {
      if (myChart) myChart.off(t); else for (var e = 0; e < myCharts.length; ++e)myCharts[e].off(t)
    }), _events.length = 0
  }

  function updateConfigGUI () {
    if (gui && ($(gui.domElement).remove(), gui.destroy(), gui = null), app.config) {
      gui = new dat.GUI({autoPlace: !1}), $(gui.domElement).css({
        position: "absolute",
        right: 5,
        top: 0,
        zIndex: 1e3
      }), $("#chart-panel").append(gui.domElement);
      var t = app.configParameters || {};
      for (var e in app.config) {
        var n = app.config[e];
        if ("onChange" !== e && "onFinishChange" !== e) {
          var i = !1, o = null;
          if (t[e] && (t[e].options ? o = gui.add(app.config, e, t[e].options) : null != t[e].min && (o = gui.add(app.config, e, t[e].min, t[e].max), null != t[e].step && o.step(t[e].step))), "string" == typeof n)try {
            var a = echarts.color.parse(n);
            i = !!a, i && (n = echarts.color.stringify(a, "rgba")), app.config[e] = n
          } catch (r) {
          }
          o || (o = gui[i ? "addColor" : "add"](app.config, e)), app.config.onChange && o.onChange(app.config.onChange), app.config.onFinishChange && o.onFinishChange(app.config.onFinishChange)
        }
      }
    }
  }

  function renderPartialCanvas (t, e, n) {
    var i = document.createElement("canvas");
    i.width = 2 * e, i.height = 2 * n;
    var o = document.createElement("canvas");
    o.width = e, o.height = n;
    var a = o.getContext("2d"), r = echarts.init(i), s = myChart ? myChart.getOption() : myCharts[t].getOption(),
      h = myChart ? myChart.getModel() : myCharts[t].getModel(), _ = h.getComponent("title"), p = [],
      l = ["markLine", "markPoint", "markArea", "series", "xAxis", "yAxis", "xAxis3D", "yAxis3D", "zAxis3D", "angleAxis", "radiusAxis", "parallelAxis", "axisPointer"];
    for (var c in s)l.indexOf(c) < 0 && h.getComponent(c) && ("grid" === c && h.getComponent("xAxis") && h.getComponent("yAxis") || "grid" !== c) && p.push({
      type: "component",
      value: c
    });
    var d = {};
    h.eachComponent("series", function (t) {
      var e = t.subType;
      d[e] || (d[e] = !0, p.push({type: "chart", value: e}))
    });
    var u = {};
    if (h.eachComponent("series", function (t) {
        ["markPoint", "markLine", "markArea"].forEach(function (e) {
          t.get(e, !0) && !u[e] && (p.push({type: "component", value: e}), u[e] = !0)
        })
      }), s.timeline && s.timeline.length) {
      var g = s.timeline[0];
      g.currentIndex = 0, s.timeline = null;
      var m = {timeline: g, options: []};
      s.animation = !1;
      for (var w = 0; w < g.data.length; w++)m.options.push(s);
      s = m
    }
    return s.animation = !1, s.series && s.series.forEach(function (t) {
      "graph" === t.type && "force" === t.layout && (t.force = t.force || {}, t.force.layoutAnimation = !1), t.progressive = 0, t.progressiveThreshold = 1 / 0
    }), r.setOption(s, !0), a.drawImage(i, 0, 0, o.width, o.height), {
      title: _ && _.get("text") || "",
      subtitle: _ && _.get("subtext") || "",
      tags: p,
      canvas: o
    }
  }

  var _originWhiteList = ["http://gallery.echartsjs.com", "http://127.0.0.1:3000", "http://echarts.duapp.com"],
    myChart = null, myCharts = [];
  $(document).ready(function () {
    function t (t) {
      var e = t.data, n = e.action;
      __actions__[n] && __actions__[n](e)
    }

    if (window.addEventListener ? window.addEventListener("message", t, !1) : window.attachEvent("onmessage", t), window.__currentLayout__ && window.__layoutCustomized__)var e = window.__layoutWidth__.length * window.__layoutHeight__.length; else var e = 0;
    __actions__.create(e)
  });
  var app = {}, gui, _intervalIdList = [], _timeoutIdList = [], _oldSetTimeout = window.setTimeout,
    _oldSetInterval = window.setInterval, _windowTopOrigin = "";
  window.setTimeout = function (t, e) {
    var n = _oldSetTimeout(t, e);
    return _timeoutIdList.push(n), n
  }, window.setInterval = function (t, e) {
    var n = _oldSetInterval(t, e);
    return _intervalIdList.push(n), n
  };
  var syncBackTimeout = 0, _events = [], __actions__ = {
    useOrigin: function (t) {
      _originWhiteList.indexOf(t.origin) >= 0 && (_windowTopOrigin = t.origin)
    }, resize: function () {
      myChart && myChart.resize();
      for (var t = 0; t < myCharts.length; ++t)myCharts[t].resize();
      _windowTopOrigin && window.top.postMessage({action: "afterResize"}, _windowTopOrigin)
    }, create: function (t) {
      if (t) {
        myChart && myChart.dispose(), myChart = null, $("#chart-panel").html("");
        for (var e = 0; e < myCharts.length; ++e)myCharts[e] && myCharts[e].dispose();
        myCharts = [];
        var n = t;
        if (window.__currentLayout__ && window.__layoutCustomized__) n = window.__layoutWidth__.length * window.__layoutHeight__.length; else if (window.__layoutWidth__ = [], window.__layoutHeight__ = [], "1xN" === window.__currentLayout__) {
          for (var e = 0; e < n; ++e)window.__layoutWidth__.push(100 / n + "%");
          window.__layoutHeight__.push("100%")
        } else if ("NxM" === window.__currentLayout__) {
          for (var i = Math.ceil(Math.sqrt(n)), e = 0; e < i; ++e)window.__layoutWidth__.push(100 / i + "%");
          for (var o = Math.ceil(n / i), e = 0; e < o; ++e)window.__layoutHeight__.push(100 / o + "%")
        } else {
          window.__layoutWidth__.push("100%");
          for (var e = 0; e < n; ++e)window.__layoutHeight__.push(100 / n + "%")
        }
        t < n && console.warn("部分图表没有对应的布局项，因而未被显示。");
        for (var a = 0, r = 0; r < window.__layoutHeight__.length; ++r)for (var s = 0; s < window.__layoutWidth__.length && !(a >= t); ++s) {
          var h = $('<div style="width: ' + window.__layoutWidth__[s] + "; height: " + window.__layoutHeight__[r] + '; float: left; display: inline-block"></div>');
          $("#chart-panel").append(h);
          var _ = echarts.init(h[0], window.__currentTheme__);
          _wrapEChartsSetOption(_), _wrapOnMethods(_), myCharts.push(_), ++a
        }
      } else myChart && myChart.dispose(), myChart = echarts.init($("#chart-panel")[0], window.__currentTheme__), myCharts = [myChart], _wrapEChartsSetOption(myChart), _wrapOnMethods(myChart)
    }, run: function (data) {
      _clearTimeTickers(), _clearChartEvents(), app.config = null;
      var __err__, option, options;
      try {
        eval(data.code), updateConfigGUI()
      } catch (e) {
        option = myChart.getModel() ? null : {series: []}, __err__ = e.toString()
      }
      if (option) myChart.setOption(option, !0); else if (options) {
        options.length !== myCharts.length && __actions__.create(options.length);
        for (var i = 0; i < myCharts.length; ++i)options[i] && myCharts[i].setOption(options[i])
      }
      _windowTopOrigin && window.top.postMessage({
        action: "afterRun",
        error: __err__,
        chartCnt: myChart ? 1 : myCharts.length
      }, _windowTopOrigin)
    }, prepareChartDetail: function (t) {
      var e = document.createElement("canvas");
      e.width = 400, e.height = 300;
      for (var n = e.getContext("2d"), i = "", o = "", a = [], r = Number.MAX_VALUE, s = 0, h = Number.MAX_VALUE, _ = 0, p = [], l = 0; l < myCharts.length; ++l) {
        var c = (myCharts[l].getRenderedCanvas(), myCharts[l].getDom().getBoundingClientRect());
        p.push(c), r = Math.min(r, c.left), s = Math.max(s, c.right), h = Math.min(h, c.top), _ = Math.max(_, c.bottom)
      }
      var d, u = s - r, g = _ - h;
      try {
        for (var l = 0; l < myCharts.length; ++l) {
          var m = p[l], w = (m.right - m.left) / u * e.width, f = (m.bottom - m.top) / g * e.height,
            y = {left: r + (m.left - r) / u * e.width, top: h + (m.top - h) / g * e.height},
            v = renderPartialCanvas(l, w, f);
          n.drawImage(v.canvas, y.left, y.top), i = i || v.title, o = o || v.subtitle, a = a.concat(v.tags)
        }
        d = e.toDataURL()
      } catch (C) {
        console.error(C), d = ""
      }
      _windowTopOrigin && window.top.postMessage({
        onlyScreenshot: t.onlyScreenshot,
        action: "afterPrepared",
        echartsVersion: echarts.version,
        title: i,
        description: o,
        tags: a,
        thumbUrl: d
      }, _windowTopOrigin)
    }
  }
}]);