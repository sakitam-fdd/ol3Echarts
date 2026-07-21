# Bridger for OpenLayers and Apache ECharts

[![CI](https://github.com/sakitam-fdd/ol3Echarts/actions/workflows/main.yml/badge.svg)](https://github.com/sakitam-fdd/ol3Echarts/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/sakitam-fdd/ol3Echarts/branch/master/graph/badge.svg)](https://codecov.io/gh/sakitam-fdd/ol3Echarts)
[![GitHub stars](https://img.shields.io/github/stars/sakitam-fdd/ol3Echarts.svg)](https://github.com/sakitam-fdd/ol3Echarts/stargazers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/sakitam-fdd/ol3Echarts/master/LICENSE)

将 [Apache ECharts](https://echarts.apache.org/) 图层叠加到 [OpenLayers](https://openlayers.org/) 地图上，自动同步视图与坐标系。

## 包支持

| Project | Version | Description |
|---------|---------|-------------|
| [ol-echarts](./packages/ol-echarts) | [![Npm package](https://img.shields.io/npm/v/ol-echarts.svg)](https://www.npmjs.org/package/ol-echarts) | 面向 `ol` **7 / 8 / 9 / 10**（推荐） |
| [ol3-echarts](./packages/ol3-echarts) | [![Npm package](https://img.shields.io/npm/v/ol3-echarts.svg)](https://www.npmjs.org/package/ol3-echarts) | 面向旧版 `openlayers` 3 / 4 |

### TIP

- OpenLayers **7+** 请使用 `ol-echarts` **v4.x**
- OpenLayers **5 / 6** 请使用 `ol-echarts` **v3.x**
- 原因见 [issues/115](https://github.com/sakitam-fdd/ol3Echarts/issues/115#issuecomment-1627004544)

## 开发

要求 Node.js 24（最低 22）和 `package.json#packageManager` 指定的 pnpm 版本。

```bash
git clone https://github.com/sakitam-fdd/ol3Echarts.git
cd ol3Echarts
pnpm install --frozen-lockfile
pnpm check
```

## 安装

```bash
# 现代 ol 包（推荐）
pnpm add ol-echarts ol echarts

# 旧版 openlayers
pnpm add ol3-echarts openlayers echarts
```

```ts
import EChartsLayer from 'ol-echarts';
// 或
import ol3Echarts from 'ol3-echarts';
```

### CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@10.9.0/ol.css" />
<script src="https://cdn.jsdelivr.net/npm/ol@10.9.0/dist/ol.js"></script>
<script src="https://cdn.jsdelivr.net/npm/echarts@6.1.0/dist/echarts.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ol-echarts@4.0.1/dist/ol-echarts.js"></script>
```

全局变量：`ol`、`echarts`、`EChartsLayer`。

#### [示例](https://sakitam-fdd.github.io/ol3Echarts/)
#### [文档](https://sakitam-fdd.github.io/ol3Echarts/docs/)

## 快速示例

```ts
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import EChartsLayer from 'ol-echarts';

const map = new Map({
  target: 'map',
  layers: [new TileLayer({ source: new OSM() })],
  view: new View({
    center: fromLonLat([108.18, 34.34]),
    zoom: 5,
  }),
});

const layer = new EChartsLayer(
  {
    series: [
      {
        type: 'effectScatter',
        data: [
          [116.4, 39.9, 100],
          [121.47, 31.23, 80],
        ],
        symbolSize: (val) => val[2] / 10,
      },
    ],
  },
  {
    hideOnMoving: true,
    hideOnZooming: true,
    hideOffscreenLabels: true,
  },
);

layer.appendTo(map);
```

`pie` / `bar` / `line` 可通过扩展字段 `coordinates: [lng, lat]` 锚定到地图位置。

遇到饼图越界引导线、Tooltip 或投影问题，请查看[常见问题](https://sakitam-fdd.github.io/ol3Echarts/docs/troubleshooting)。仓库维护约束见 [AGENTS.md](./AGENTS.md)。

## 截图示例

![散点图](https://raw.githubusercontent.com/sakitam-fdd/ol3Echarts/master/docs/static/images/scatter.jpg)

![迁徙图](https://raw.githubusercontent.com/sakitam-fdd/ol3Echarts/master/docs/static/images/mock-migration.jpg)

![微博签到数据点亮中国](https://raw.githubusercontent.com/sakitam-fdd/ol3Echarts/master/docs/static/images/wchart-gl.jpg)

## 致谢

> [echarts](https://github.com/apache/echarts)
> [openlayers](https://github.com/openlayers/openlayers)

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fsakitam-fdd%2Fol3Echarts.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fsakitam-fdd%2Fol3Echarts?ref=badge_large)
