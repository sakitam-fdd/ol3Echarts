# ol3Echarts 

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
npm run karma.test
npm run karma.cover
```

### 安装

#### npm安装

```bash
npm install ol3-echarts --save
import ol3Echarts from 'ol3-echarts'
```

#### cdn

目前可通过 [unpkg.com](https://unpkg.com/ol3-echarts@1.3.0/dist/ol3Echarts.js) 获取最新版本的资源。

```bash
https://unpkg.com/ol3-echarts/dist/ol3Echarts.js
https://unpkg.com/ol3-echarts/dist/ol3Echarts.min.js
```

#### [示例](//sakitam-fdd.github.io/ol3Echarts/)
#### [文档](//sakitam-fdd.github.io/ol3Echarts/docs/)

##### openlayers

``` javascript
<div id="map"></div>
<script src="https://cdn.jsdelivr.net/npm/hmap-js/dist/hmap.js"></script>
<script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ol3-echarts/dist/ol3Echarts.js"></script>
<script>
  var Map = new ol.Map({
    target: container,
    layers: [
      new ol.layer.Tile({
        preload: 4,
        source: new ol.source.OSM()
      })
    ],
    loadTilesWhileAnimating: true,
    view: new ol.View({
      projection: 'EPSG:4326',
      center: [120.74758724751435, 30.760422266949334],
      zoom: 8
    })
  });
  var echartslayer = new ol3Echarts(echartsOption, {
    target: '.ol-overlaycontainer',
    source: '',
    destination: '',
    hideOnMoving: true
  });
  echartslayer.appendTo(Map)
</script>
```

##### hmap-js

``` javascript
<div id="map"></div>
<script src="https://cdn.jsdelivr.net/npm/hmap-js/dist/hmap.js"></script>
<script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ol3-echarts/dist/ol3Echarts.js"></script>
<script>
  var Maps = new HMap('map', {
    controls: {
      loading: true,
      zoomSlider: true,
      fullScreen: false
    },
    view: {
      center: [113.53450137499999, 34.44104525],
      projection: 'EPSG:4326',
      zoom: 5, // resolution
    },
    baseLayers: [
      {
        layerName: 'vector',
        isDefault: true,
        layerType: 'TileXYZ',
        projection: 'EPSG:3857',
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
  var echartslayer = new ol3Echarts(echartsOption, {
    target: '.ol-overlaycontainer',
    source: '',
    destination: '',
    hideOnMoving: true
  });
  echartslayer.appendTo(Maps.getMap())
</script>
```

## 截图示例

![散点图](https://raw.githubusercontent.com/sakitam-fdd/ol3Echarts/master/docs/assets/images/scatter.jpg)

![迁徙图](https://raw.githubusercontent.com/sakitam-fdd/ol3Echarts/master/docs/assets/images/mock-migration.jpg)

![微博签到数据点亮中国](https://raw.githubusercontent.com/sakitam-fdd/ol3Echarts/master/docs/assets/images/wchart-gl.jpg)

其他示例请自己挖掘

## 致谢

> [echarts](https://github.com/ecomfe/echarts)
> [openlayers](https://github.com/openlayers/openlayers)
