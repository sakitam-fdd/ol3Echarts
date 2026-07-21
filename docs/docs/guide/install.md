---
id: install
title: 安装
sidebar_label: 安装
slug: /install
description: 了解如何安装 ol-echarts / ol3-echarts
---

## 包选择

| 包名 | 适用场景 | OpenLayers | ECharts |
|------|----------|------------|---------|
| [`ol-echarts`](https://www.npmjs.com/package/ol-echarts) | 模块化构建（Vite / Webpack / Rollup） | `ol` **7 / 8 / 9 / 10** | **≥ 5**（推荐 5 / 6） |
| [`ol3-echarts`](https://www.npmjs.com/package/ol3-echarts) | 旧版 `openlayers` 包或 CDN 全局变量 | OpenLayers **3 / 4** | **≥ 5** |

:::tip 版本提示
- OpenLayers **7+** 请使用 `ol-echarts` **v4.x**
- OpenLayers **5 / 6** 请使用 `ol-echarts` **v3.x**
- 详见 [issues/115](https://github.com/sakitam-fdd/ol3Echarts/issues/115#issuecomment-1627004544)
:::

## npm / pnpm / yarn

```bash
# 推荐：现代 ol 包
pnpm add ol-echarts ol echarts
# 或
npm install ol-echarts ol echarts --save

# 旧版 openlayers 全局构建
pnpm add ol3-echarts openlayers echarts
```

```ts
// ol + 打包工具
import EChartsLayer from 'ol-echarts';

// 旧版 openlayers
import ol3Echarts from 'ol3-echarts';
```

## CDN

### 现代 OpenLayers（推荐）

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@10.9.0/ol.css" />
<script src="https://cdn.jsdelivr.net/npm/ol@10.9.0/dist/ol.js"></script>
<script src="https://cdn.jsdelivr.net/npm/echarts@6.1.0/dist/echarts.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ol-echarts@4.0.1/dist/ol-echarts.js"></script>
```

全局变量：`ol`、`echarts`、`EChartsLayer`。

### 旧版 openlayers

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/openlayers@4.6.5/dist/ol.css" />
<script src="https://cdn.jsdelivr.net/npm/openlayers@4.6.5/dist/ol.js"></script>
<script src="https://cdn.jsdelivr.net/npm/echarts@6.1.0/dist/echarts.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ol3-echarts@3.0.1/dist/ol3Echarts.js"></script>
```

全局变量：`ol`、`echarts`、`ol3Echarts`。

:::caution
CDN 请尽量锁定版本号，避免缓存命中旧资源。
:::

## Peer 依赖

`ol-echarts` 不会打包 `ol` / `echarts`，需要在业务项目中自行安装：

```json
{
  "peerDependencies": {
    "echarts": ">=5.0.0",
    "ol": "^7.0.0 || ^8.0.0 || ^9.0.0 || ^10.0.0"
  }
}
```
