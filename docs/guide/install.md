#### npm安装

```bash
// old openlayers package
npm install ol3-echarts --save
import ol3Echarts from 'ol3-echarts'

// ol package
npm install ol-echarts --save
import EChartsLayer from 'ol-echarts'

// 指定版本安装
npm install ol3-echarts@1.2.0 --save
import ol3Echarts from 'ol3-echarts'

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
