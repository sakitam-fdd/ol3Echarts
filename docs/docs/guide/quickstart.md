---
id: quickstart
title: 快速开始
sidebar_label: 快速开始
slug: /quickstart
description: 使用 OpenLayers 与 ECharts 快速接入 ol-echarts
---

## 前置条件

你需要熟悉：

- [OpenLayers Map / View](https://openlayers.org/en/latest/apidoc/)
- [Apache ECharts option](https://echarts.apache.org/handbook/zh/get-started/)

## 模块化示例（推荐）

```ts
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import EChartsLayer from 'ol-echarts';

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: fromLonLat([108.18, 34.34]),
    zoom: 5,
  }),
});

const chart = new EChartsLayer(
  {
    tooltip: { trigger: 'item', confine: true },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: 30,
        coordinates: [110.53, 33.44],
        data: [
          { value: 335, name: '直接访问' },
          { value: 310, name: '邮件营销' },
          { value: 1548, name: '搜索引擎' },
        ],
      },
    ],
  },
  {
    hideOnMoving: true,
    hideOnZooming: true,
    hideOffscreenLabels: true,
    // OL 7+ 一般不需要开启
    polyfillEvents: false,
  },
);

chart.appendTo(map);

chart.on('load', ({ value: echartsInstance }) => {
  // 可在此处绑定 echarts 事件
  console.log(echartsInstance);
});
```

## CDN 示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ol-echarts quickstart</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@10.9.0/ol.css" />
    <style>
      html, body, #map { margin: 0; height: 100%; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://cdn.jsdelivr.net/npm/ol@10.9.0/dist/ol.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/echarts@6.1.0/dist/echarts.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/ol-echarts@4.0.1/dist/ol-echarts.js"></script>
    <script>
      const map = new ol.Map({
        target: 'map',
        layers: [new ol.layer.Tile({ source: new ol.source.OSM() })],
        view: new ol.View({
          center: ol.proj.fromLonLat([108.18, 34.34]),
          zoom: 5,
        }),
      });

      const layer = new EChartsLayer({
        series: [
          {
            type: 'effectScatter',
            coordinateSystem: 'geo', // 可省略，库会自动注入 openlayers 坐标系
            data: [[116.4, 39.9, 100], [121.47, 31.23, 80]],
            symbolSize: (val) => val[2] / 10,
          },
        ],
      }, {
        hideOnMoving: true,
      });

      layer.appendTo(map);
    </script>
  </body>
</html>
```

:::note
对 `scatter` / `effectScatter` / `lines` 等地理系列，无需手动写 `coordinateSystem`；库会在内部注册并注入 OpenLayers 坐标系。
对 `pie` / `bar` / `line`，请使用扩展字段 `coordinates: [lng, lat]` 指定地图锚点。
:::

## 配置项

```ts
type EChartsLayerOptions = {
  source?: string;                 // 数据源投影，默认 EPSG:4326
  destination?: string;            // 目标投影，默认取地图视图投影
  forcedRerender?: boolean;        // 重绘前 clear，默认 false
  forcedPrecomposeRerender?: boolean; // precompose 时重绘，默认 false
  hideOnZooming?: boolean;
  hideOnMoving?: boolean;
  hideOnRotating?: boolean;
  hideOffscreenLabels?: boolean;  // 默认 true，抑制视口外 pie 引导线
  convertTypes?: string[];         // 默认 ['pie', 'line', 'bar']
  insertFirst?: boolean;
  stopEvent?: boolean;
  polyfillEvents?: boolean;        // OL <= 6.1.1 默认 true，OL 7+ 默认 false
};
```

| 配置项 | 说明 |
| --- | --- |
| `source` | 数据源投影 code |
| `destination` | 渲染目标投影；不传时取地图视图投影 |
| `forcedRerender` | 是否在重绘前调用 `clear()`，有性能代价 |
| `forcedPrecomposeRerender` | 是否在 `precompose` 时同步重绘 |
| `hideOnZooming` / `hideOnMoving` / `hideOnRotating` | 交互时隐藏图层以提升体验 |
| `hideOffscreenLabels` | 地图锚点移出视口时隐藏 pie 标签和引导线，默认 `true` |
| `insertFirst` | 是否插入到 overlay 容器最前 |
| `stopEvent` | 是否使用 `ol-overlaycontainer-stopevent` |
| `polyfillEvents` | 将地图指针事件代理到 zrender（旧版 OL 鼠标问题） |

:::tip 越界渲染
Tooltip 请优先配置 `tooltip.confine: true`。饼图引导线、Tooltip 与通用 graphic 裁剪属于不同问题，完整说明见[常见问题与排查](./troubleshooting.md)。
:::

## 常用 API

```ts
layer.appendTo(map);
layer.setChartOptions(option);
layer.getChartOptions();
layer.getECharts();
layer.getOptions();
layer.appendData({ seriesIndex: 0, data: [...] });
layer.show();
layer.hide();
layer.setVisible(false);
layer.setZIndex(10);
layer.remove();
```

## 事件

| 事件 | 说明 |
| --- | --- |
| `load` | 图层与 ECharts 实例创建完成，`event.value` 为 echarts 实例 |
| `redraw` | 图层重绘 |
| `change:size` | 地图尺寸变化 |
| `zoomstart` / `zoomend` | 缩放开始 / 结束 |
| `movestart` / `moveend` | 平移开始 / 结束 |
| `change:center` | 中心点变化 |
| `change:rotation` | 旋转角度变化 |

```ts
layer.on('load', (event) => {
  const chart = event.value;
  chart.on('click', (params) => console.log(params));
});
```

## 从旧版本升级

### 1.x → 2.x

- 可在任意时机初始化图层，再 `appendTo`
- 不再强制手动写 `coordinateSystem`
- 新增 `hideOn*` / `polyfillEvents` 等配置

### 2.x → 3.x / 4.x

- 适配 OpenLayers 模块化 API（`ol` 包）
- **v4.x** 面向 OpenLayers **7+**（含 8 / 9 / 10）
- TypeScript 类型更完整，可直接导入 `EChartsLayerOptions` / `ChartOptions`

```ts
import EChartsLayer, { type EChartsLayerOptions, type ChartOptions } from 'ol-echarts';
```
