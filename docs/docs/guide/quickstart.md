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
