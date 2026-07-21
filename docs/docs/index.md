# ol-echarts

将 Apache ECharts 图层叠加到 OpenLayers 地图，自动同步视图变换与坐标系。

## 包选择

| 包 | 适用 |
|----|------|
| [`ol-echarts`](https://www.npmjs.com/package/ol-echarts) | `ol` 7 / 8 / 9 / 10 + 模块化构建（推荐） |
| [`ol3-echarts`](https://www.npmjs.com/package/ol3-echarts) | 旧版 `openlayers` 3 / 4 或对应 CDN |

:::tip
OpenLayers 7+ 使用 `ol-echarts` v4.x；OpenLayers 5/6 使用 v3.x。见 [issues/115](https://github.com/sakitam-fdd/ol3Echarts/issues/115#issuecomment-1627004544)。
:::

## 本地开发

```bash
git clone https://github.com/sakitam-fdd/ol3Echarts.git
cd ol3Echarts
pnpm install
pnpm run dev
pnpm run build
pnpm run test
```

## 安装

```bash
pnpm add ol-echarts ol echarts
```

```ts
import EChartsLayer from 'ol-echarts';
```

CDN：

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@10.9.0/ol.css" />
<script src="https://cdn.jsdelivr.net/npm/ol@10.9.0/dist/ol.js"></script>
<script src="https://cdn.jsdelivr.net/npm/echarts@6.1.0/dist/echarts.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ol-echarts@4.0.1/dist/ol-echarts.js"></script>
```

## 下一步

- [安装](./guide/install.md)
- [快速开始](./guide/quickstart.md)
- [实现原理](./guide/core.md)
- [常见问题](./guide/troubleshooting.md)
- [开发与维护](./guide/development.md)
