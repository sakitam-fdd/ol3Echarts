# ol-echarts

OpenLayers (`ol` 7 / 8 / 9 / 10) 与 Apache ECharts（5 / 6）的桥接图层。

## Install

```bash
pnpm add ol-echarts ol echarts
```

```ts
import EChartsLayer, { type EChartsLayerOptions, type ChartOptions } from 'ol-echarts';
```

## Usage

```ts
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import EChartsLayer from 'ol-echarts';

const map = new Map({
  target: 'map',
  layers: [new TileLayer({ source: new OSM() })],
  view: new View({
    projection: 'EPSG:4326',
    center: [108.18, 34.34],
    zoom: 5,
  }),
});

const layer = new EChartsLayer(option, {
  hideOnMoving: true,
  hideOnZooming: true,
  hideOffscreenLabels: true,
});
layer.appendTo(map);
```

## Options

| 配置项 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `source` | `string` | `EPSG:4326` | 数据源投影 |
| `destination` | `string` | 地图视图投影 | 目标投影 |
| `forcedRerender` | `boolean` | `false` | 重绘前 `clear()` |
| `forcedPrecomposeRerender` | `boolean` | `false` | `prerender` 时重绘（兼容旧选项名） |
| `hideOnZooming` / `hideOnMoving` / `hideOnRotating` | `boolean` | `false` | 交互时隐藏 |
| `hideOffscreenLabels` | `boolean` | `true` | pie 锚点移出视口时隐藏标签和引导线 |
| `convertTypes` | `string[]` | `['pie','line','bar']` | 使用 `coordinates` 转换的图表类型 |
| `insertFirst` | `boolean` | `false` | 插入到 overlay 最前 |
| `stopEvent` | `boolean` | `false` | 使用 stopevent 容器 |
| `polyfillEvents` | `boolean` | OL≤6.1.1 为 `true` | 指针事件代理 |

## API

- `appendTo(map)` / `setMap(map)`
- `setChartOptions(option)` / `getChartOptions()`
- `getECharts()` / `getOptions()`
- `appendData({ seriesIndex, data })`
- `show()` / `hide()` / `setVisible()` / `isVisible()`
- `setZIndex()` / `getZIndex()`
- `remove()`

## Docs

- 仓库文档：https://sakitam-fdd.github.io/ol3Echarts/
- 旧版 openlayers 请使用 [`ol3-echarts`](../ol3-echarts)
