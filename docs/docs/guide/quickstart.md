---
id: quickstart
title: 快速开始
sidebar_label: 快速开始
slug: /quickstart
description: 了解如何快速使用此类库
---

## 快速开始

这里假设你已了解openlayers和echarts的使用方法

## 说明

> 因为ol3Echarts是基于openlayers和Echarts开发而来，所以必须引入ol和echarts类库。
  同时需要拿到 `ol.Map` 的地图对象实例，因为HMap是基于openlayers的二次开发，所以
  可以看做是ol的增强，并未改变其内置对象，以下地图实例全部基于HMap。

## 第一个示例

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <title>ol3-Echarts</title>
  <link rel="stylesheet" href="https://unpkg.com/hmap-js/dist/hmap.css">
  <style>
    html, body, #map {
      height: 100%;
      padding: 0;
      margin: 0;
    }
    .hmap-control-zoom {
      right: 30px;
    }
  </style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/hmap-js/dist/hmap.js"></script>
<script src="https://unpkg.com/jquery/dist/jquery.js"></script>
<script src="https://unpkg.com/echarts/dist/echarts.js"></script>
<script src="https://unpkg.com/ol3-echarts/dist/ol3Echarts.js"></script>
<script>
  document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
      var Maps = new HMap('map', {
        controls: {
          loading: true,
          zoomSlider: true,
          fullScreen: false
        },
        view: {
          center: [11464017.313439976, 3934744.6720247352],
          extent: [-2.0037507067161843E7, -3.0240971958386254E7, 2.0037507067161843E7, 3.0240971958386205E7],
          projection: 'EPSG:102100',
          tileSize: 256,
          zoom: 5, // resolution
        },
        baseLayers: [
          {
            layerName: 'vector',
            isDefault: true,
            layerType: 'TileXYZ',
            tileGrid: {
              tileSize: 256,
              extent: [-2.0037507067161843E7, -3.0240971958386254E7, 2.0037507067161843E7, 3.0240971958386205E7],
              origin: [-2.0037508342787E7, 2.0037508342787E7],
              resolutions: [
                156543.03392800014,
                78271.51696399994,
                39135.75848200009,
                19567.87924099992,
                9783.93962049996,
                4891.96981024998,
                2445.98490512499,
                1222.992452562495,
                611.4962262813797,
                305.74811314055756,
                152.87405657041106,
                76.43702828507324,
                38.21851414253662,
                19.10925707126831,
                9.554628535634155,
                4.77731426794937,
                2.388657133974685
              ]
            },
            layerUrl: 'http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
          }
        ]
      });
      var data = [{
        name: '菏泽',
        value: 194
      }];
      var geoCoordMap = {
        '菏泽': [115.480656, 35.23375]
      };
      var convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var geoCoord = geoCoordMap[data[i].name];
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value)
            });
          }
        }
        return res;
      };
      var option = {
        title: {
          text: '全国主要城市空气质量',
          subtext: 'data from PM25.in',
          sublink: 'http://www.pm25.in',
          left: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          y: 'top',
          x: 'right',
          data: ['pm2.5'],
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: 'pm2.5',
            type: 'scatter',
            data: convertData(data),
            symbolSize: function (val) {
              return val[2] / 10;
            },
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: false
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: '#ddb926'
              }
            }
          },
          {
            name: 'Top 5',
            type: 'effectScatter',
            data: convertData(data.sort(function (a, b) {
              return b.value - a.value;
            }).slice(0, 6)),
            symbolSize: function (val) {
              return val[2] / 10;
            },
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: '#f4e925',
                shadowBlur: 10,
                shadowColor: '#333'
              }
            },
            zlevel: 1
          }]
      };
      var echartslayer = new ol3Echarts(option);
      echartslayer.appendTo(Maps.getMap());
    }
  }
</script>
</body>
</html>
```

### 尝试编辑它

<iframe width="100%" height="430" src="//jsfiddle.net/sakitamfdd/pjz8cuxw/embedded/result,html,js/?bodyColor=fff" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## 从1.2.0升级到1.3.0

> 因为在重构时项目架构全部推翻重来，所以大部分使用方式做了一些调整

* 图层初始化：可以在任意时间初始化echarts图层，不需要再手动监听地图是否渲染后在初始化，适应更多场景。
* 添加到地图：不需要再初始化时传入地图对象，可以在地图初始化后再 ``appendTo`` 到地图, 并且
  渲染是在添加到地图后且存在echarts图层配置才会渲染，减少内存开销。
* 优化了echarts配置，不需要再强制传入 coordinateSystem 字段。
* 新增了四个参数，详见 ``api``, 可增强用户体验，减少卡顿。
* 修复了 ``echarts-gl`` 兼容问题，相关示例正在添加。

## 新增 ``ol`` package 的兼容类库。

## 升级到2.0+

好吧，2.0版本又修改了一些参数，主要是新增一些配置项，移除了自定义容器`target`的配置, 默认只允许添加到`ol-overlaycontainer`和`ol-overlaycontainer-stopevent`容器，
这样能保证了事件的正确捕获。同样针对 `openlayers5+`出现的事件捕获异常添加了一个polyfill, 可以通过配置项`polyfillEvents` 进行开启，如果没有碰到此问题可以忽略此参数。
并且修复了多地图容器时自定义坐标系不起作用的问题，另外较大的改变是支持了`typescript`。其他相关配置项的改变详见 `API` 文档。


### 如何使用

> 注意：现有echarts扩展是独立于openlayers图层的

#### 初始化echarts图层并添加到地图

```javascript
var option = {} // echarts标准配置
var echartslayer = new ol3Echarts(null, {
    hideOnMoving: true,
    hideOnZooming: true
  });
echartslayer.appendTo(map);
```

#### 注意 1

> 创建 ``echartslayer`` 对象必须要在地图初始化完成开始渲染后，即存在 `ol.Map` 实例

```bash
Maps.map instanceof ol.Map // true
```

从`2.0.5`版本开始不强制判断 map instanceof ol.Map，可以在 `appendTo` 指定第二个参数忽略判断，以兼容可能基于 ol 二次封装的类库

```js
echartslayer.appendTo(map, true);
```

#### 注意 3

> 配置

```javascript
params = {
  source: '',
  destination: '',
  forcedRerender: false,
  forcedPrecomposeRerender: true,
  hideOnZooming: false, // when zooming hide chart
  hideOnMoving: false, // when moving hide chart
  hideOnRotating: false, // // when Rotating hide chart
  convertTypes: [], // 支持非地理空间坐标的图表类型，不需要配置
  insertFirst: true, // https://openlayers.org/en/latest/apidoc/module-ol_Overlay-Overlay.html
  stopEvent: false, // https://openlayers.org/en/latest/apidoc/module-ol_Overlay-Overlay.html
  polyfillEvents: false, // 代理echrats图层的 mousedown mouseup click 事件
}
```

配置项说明

| 配置项 | 简介 | 类型 | 备注 |
| --- | --- | --- | --- |
| source | 数据源投影 | `String` | 投影系 `code` 常用 EPSG:4326, EPSG:3857 |
| destination | 数据目标投影 | `String` | 渲染数据的目标投影，不传时从地图视图获取 |
| forcedRerender | 是否开启强制重新渲染 | `boolean` | 默认 `false`, 注意开启后可能会造成性能损失，建议不开启。 |
| forcedPrecomposeRerender | 是否在地图渲染之前刷新echarts图层 | `boolean` | 默认 `false`, 注意开启后可以保证图层无滞后，但是会造成大量重绘，不建议开启。 |
| hideOnZooming | 缩放时是否隐藏 | `boolean` | 默认 `false`, 注意开启后会提升性能和用户体验 |
| hideOnMoving | 拖动时是否隐藏 | `boolean` | 默认 `false`, 注意开启后会提升性能和用户体验 |
| hideOnRotating | 旋转时是否隐藏 | `boolean` | 默认 `false`, 注意开启后会提升性能和用户体验 |
| insertFirst | 是否插入到前方 | `boolean` | 默认 `false`, 详细内容请查看`https://openlayers.org/en/latest/apidoc/module-ol_Overlay-Overlay.html` |
| stopEvent | 是否阻止事件传递到地图上 | `boolean` | 默认 `false`, 详细内容请查看 `https://openlayers.org/en/latest/apidoc/module-ol_Overlay-Overlay.html` |
| polyfillEvents | 代理echrats图层的 mousedown mouseup click 事件 | `boolean` | 默认 `false`, 仅作为在事件捕获异常时配置开启 |

### 事件

``` js
echartslayer.on('redraw', function (event) {
  console.log(this, event)
});
```

支持的事件系统如下：

| 事件名 | 简介 | 类型 | 备注 |
| --- | --- | --- | --- |
| load | echarts图层创建完成后厨房 | `String` | 此时`echarts`实例也已创建完毕，可以在此事件回调内添加`echarts`的事件监听 |
| redraw | 图层重新渲染事件 | `String` | 注意：因为耦合原因, 每次重绘事件可能不只触发一次 |
| change:size | 地图大小变化事件 | `String` | -- |
| zoomend | 地图缩放结束事件 | `String` | -- |
| change:rotation | 地图旋转角度变化事件 | `String` | -- |
| movestart | 地图拖拽开始事件 | `String` | -- |
| moveend | 地图拖拽结束事件 | `String` | -- |
| change:center | 地图中心点变化事件 | `String` | -- |
