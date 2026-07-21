# ol3-echarts（Legacy）

面向旧版 `openlayers` 3 / 4 的 Apache ECharts 桥接包。

> 新项目请使用 [`ol-echarts`](../ol-echarts)，它面向模块化 `ol` 7–10，并提供更完整的 TypeScript 类型与维护保障。

## 安装

```bash
pnpm add ol3-echarts openlayers echarts
```

```ts
import ol from 'openlayers';
import EChartsLayer from 'ol3-echarts';

const map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
  ],
  view: new ol.View({
    projection: 'EPSG:4326',
    center: [108.18, 34.34],
    zoom: 5,
  }),
});

const layer = new EChartsLayer(option, {
  hideOnMoving: true,
  hideOffscreenLabels: true,
});

layer.appendTo(map);
```

## CDN

锁定版本可避免 CDN 缓存导致不可重复的构建：

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/openlayers@4.6.5/dist/ol.css" />
<script src="https://cdn.jsdelivr.net/npm/openlayers@4.6.5/dist/ol.js"></script>
<script src="https://cdn.jsdelivr.net/npm/echarts@6.1.0/dist/echarts.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ol3-echarts@3.0.1/dist/ol3Echarts.js"></script>
```

全局构造器为 `ol3Echarts`。

## 维护状态

- 仅接受 OpenLayers 3 / 4 范围内的兼容修复；
- 主动开发、现代构建链与新 OpenLayers 版本支持都在 `ol-echarts`；
- 通用 API、坐标锚点和越界标签说明见[项目文档](https://sakitam-fdd.github.io/ol3Echarts/docs/)。

生命周期结束时调用 `layer.remove()`，释放 ECharts、DOM 和地图监听器。
