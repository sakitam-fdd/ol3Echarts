# ol3Echarts *[查看在线示例](https://sakitam-fdd.github.io/ol3Echarts/examples)* *[查看使用文档](https://sakitam-fdd.github.io/ol3Echarts)*

> 基于openlayers3+新版扩展的echarts3的图表插件，暂时支持echarts的所有map组件类型，对普通不支持坐标系的图表正在兼容（饼图，柱状图，折线图已兼容）

[![Build Status](https://travis-ci.org/sakitam-fdd/ol3Echarts.svg?branch=master)](https://www.travis-ci.org/sakitam-fdd/ol3Echarts)
[![codecov](https://codecov.io/gh/sakitam-fdd/ol3Echarts/branch/master/graph/badge.svg)](https://codecov.io/gh/sakitam-fdd/ol3Echarts)
[![NPM downloads](https://img.shields.io/npm/dm/ol3-echarts.svg)](https://npmjs.org/package/ol3-echarts)
![JS gzip size](http://img.badgesize.io/https://unpkg.com/ol3-echarts/dist/ol3Echarts.js?compression=gzip&label=gzip%20size:%20JS)
[![Npm package](https://img.shields.io/npm/v/ol3-echarts.svg)](https://www.npmjs.org/package/ol3-echarts)
[![GitHub stars](https://img.shields.io/github/stars/sakitam-fdd/ol3Echarts.svg)](https://github.com/sakitam-fdd/ol3Echarts/stargazers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/sakitam-fdd/ol3Echarts/master/LICENSE)

## 下载


```bash
git clone https://github.com/sakitam-fdd/ol3Echarts.git
npm install
npm run dev
npm run build
```

### 安装

#### npm安装

```bash
npm install ol3-echarts --save
import ol3Echarts from 'ol3-echarts'
```

#### cdn

目前可通过 [unpkg.com](https://unpkg.com/ol3-echarts@1.2.0/dist/ol3Echarts.js) 获取最新版本的资源。

```bash
https://unpkg.com/ol3-echarts@1.2.0/dist/ol3Echarts.js
https://unpkg.com/ol3-echarts@1.2.0/dist/ol3Echarts.min.js
```

#### 示例

*[查看在线示例](https://sakitam-fdd.github.io/ol3Echarts/examples)*

```javascript
<div id="map"></div>
<script src="https://unpkg.com/hmap-js@1.5.0/dist/hmap.js"></script>
<script src="https://unpkg.com/echarts@3.7.1/dist/echarts.js"></script>
<script src="https://unpkg.com/ol3-echarts@1.2.0/dist/ol3Echarts.js"></script>
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
        openlayers: {},
        series: [
          {
            name: 'pm2.5',
            type: 'scatter',
            coordinateSystem: 'openlayers',
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
            coordinateSystem: 'openlayers',
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
      Maps.map.once('postrender', function (e) {
        if (echartslayer !== undefined)
          return;
        var echartslayer = new ol3Echarts(Maps.map, {
          target: '.ol-overlaycontainer',
          source: '',
          destination: ''
        });
        echartslayer.chart.setOption(option);
      });
    }
  }
</script>
```

> 示例目录demo

## 截图示例
![散点图](https://raw.githubusercontent.com/sakitam-fdd/ol3Echarts/master/examples/asset/images/sdt.gif)

![迁徙图](https://raw.githubusercontent.com/sakitam-fdd/ol3Echarts/master/examples/asset/images/qxt.gif)

![春运](https://raw.githubusercontent.com/sakitam-fdd/ol3Echarts/master/examples/asset/images/qxt-cn.gif)

![公交路线](https://raw.githubusercontent.com/sakitam-fdd/ol3Echarts/master/examples/asset/images/busLine.gif)

![路况](https://raw.githubusercontent.com/sakitam-fdd/ol3Echarts/master/examples/asset/images/traffic.gif)

其他示例请自己挖掘

## 参考

>[https://github.com/ecomfe/echarts](https://github.com/ecomfe/echarts)
