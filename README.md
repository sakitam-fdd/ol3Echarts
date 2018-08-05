# ol3-echarts / ol-echarts

* ol3-echarts： 基于openlayers(3/4)新版扩展的echarts图表插件，暂时支持echarts的所有map组件类型，对普通不支持坐标系的图表正在兼容（饼图，柱状图，折线图已兼容）
* ol-echarts：基于 openlayers5(ol package)扩展的数据可视化插件，功能和 ``ol3-echarts`` 保持一致。

[![Build Status](https://travis-ci.org/sakitam-fdd/ol3Echarts.svg?branch=master)](https://www.travis-ci.org/sakitam-fdd/ol3Echarts)
[![codecov](https://codecov.io/gh/sakitam-fdd/ol3Echarts/branch/master/graph/badge.svg)](https://codecov.io/gh/sakitam-fdd/ol3Echarts)
[![NPM downloads](https://img.shields.io/npm/dm/ol3-echarts.svg)](https://npmjs.org/package/ol3-echarts)
[![](https://data.jsdelivr.com/v1/package/npm/ol3-echarts/badge)](https://www.jsdelivr.com/package/npm/ol3-echarts)
![JS gzip size](http://img.badgesize.io/https://unpkg.com/ol3-echarts/dist/ol3Echarts.js?compression=gzip&label=gzip%20size:%20JS)
[![Npm package](https://img.shields.io/npm/v/ol3-echarts.svg)](https://www.npmjs.org/package/ol3-echarts)
[![GitHub stars](https://img.shields.io/github/stars/sakitam-fdd/ol3Echarts.svg)](https://github.com/sakitam-fdd/ol3Echarts/stargazers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/sakitam-fdd/ol3Echarts/master/LICENSE)

## 下载


```bash
git clone https://github.com/sakitam-fdd/ol3Echarts.git
yarn run bootstrap
yarn run dev
yarn run build
yarn run karma.test
yarn run karma.cover
```

### 安装

#### npm安装

> 注意：npm下存在两个包 [ol3-echarts](https://npmjs.org/package/ol3-echarts) 和 [ol-echarts](https://npmjs.org/package/ol-echarts)
  前者是在使用 [openlayers](https://npmjs.org/package/openlayers) 或者是 `ol` 的cdn时使用；后者是在使用 [ol](https://npmjs.org/package/ol)
  配合打包工具使用。

```bash
// old openlayers package
npm install ol3-echarts --save
import ol3Echarts from 'ol3-echarts'

// ol package
npm install ol-echarts --save
import EChartsLayer from 'ol-echarts'

```

#### cdn

> cdn 引用方式只支持 旧版 `openlayers` 和新版 `ol` 的cdn引用方式，统一使用 `ol3-echarts` 支持。

目前可通过 [unpkg.com](https://unpkg.com/ol3-echarts/dist/ol3Echarts.js) / [jsdelivr](https://cdn.jsdelivr.net/npm/ol3-echarts/dist/ol3Echarts.js) 获取最新版本的资源。

```bash
// jsdelivr (jsdelivr由于缓存原因最好锁定版本号)
https://cdn.jsdelivr.net/npm/ol3-echarts@1.3.5/dist/ol3Echarts.js
https://cdn.jsdelivr.net/npm/ol3-echarts@1.3.5/dist/ol3Echarts.min.js
// npm
https://unpkg.com/ol3-echarts/dist/ol3Echarts.js
https://unpkg.com/ol3-echarts/dist/ol3Echarts.min.js
```

#### [示例](//sakitam-fdd.github.io/ol3Echarts/)
#### [文档](//sakitam-fdd.github.io/ol3Echarts/docs/)

##### openlayers

``` javascript
<div id="map"></div>
<script src="https://cdn.jsdelivr.net/npm/openlayers/dist/ol.js"></script>
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
    hideOnMoving: true,
    forcedRerender: false,
    forcedPrecomposeRerender: false
  });
  echartslayer.appendTo(Map)
</script>
```

#### ol package & react 

```jsx harmony
import * as React from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import 'ol/ol.css';
import EChartsLayer from 'ol-echarts';

class Index extends React.Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      zoom: 14,
      fov: 0,
      pitch: 0,
      bearing: 0
    };

    this.container = null;
    this.map = null;
  }

  componentDidMount () {
    this.map = new Map({
      target: this.container,
      view: new View({
        center: [113.53450137499999, 34.44104525],
        projection: 'EPSG:4326',
        zoom: 5 // resolution
      }),
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnline' +
            'StreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
          })
        })
      ]
    });
    const echartslayer = new EChartsLayer(option, {
      hideOnMoving: false,
      hideOnZooming: false,
      forcedPrecomposeRerender: true
    });
    echartslayer.appendTo(this.map);
    window.setTimeout(() => {
      echartslayer.remove();
    }, 10 * 1000)
  }

  setRef = (x = null) => {
    this.container = x;
  };

  render () {
    return (<div ref={this.setRef} className="map-content"></div>);
  }
}
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
    hideOnMoving: true,
    forcedRerender: false,
    forcedPrecomposeRerender: false
  });
  echartslayer.appendTo(Maps.getMap())
</script>
```

## 截图示例

![散点图](https://raw.githubusercontent.com/sakitam-fdd/ol3Echarts/master/website/static/images/scatter.jpg)

![迁徙图](https://raw.githubusercontent.com/sakitam-fdd/ol3Echarts/master/website/static/images/mock-migration.jpg)

![微博签到数据点亮中国](https://raw.githubusercontent.com/sakitam-fdd/ol3Echarts/master/website/static/images/wchart-gl.jpg)

其他示例请自己挖掘

## 致谢

> [echarts](https://github.com/ecomfe/echarts)
> [openlayers](https://github.com/openlayers/openlayers)

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fsakitam-fdd%2Fol3Echarts.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fsakitam-fdd%2Fol3Echarts?ref=badge_large)
