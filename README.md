# ol3Echarts

> 基于openlayers3+新版扩展的echarts3的图表插件，暂时支持echarts的所有map组件类型，对普通不支持坐标系的图表正在兼容（饼图，柱状图，折线图已兼容）

## 下载


```bash
git clone https://github.com/sakitam-fdd/ol3Echarts.git
npm install
npm run dev
npm run build
```

## 引用方式

### CDN引用

```bash
https://unpkg.com/ol3-echarts@1.0.0/dist/ol3Echarts.js
https://unpkg.com/ol3-echarts@1.0.0/dist/ol3Echarts.min.js
```

### NPM包管理

```bash
npm install ol3-echarts --save
import ol3Echarts from 'ol3-echarts'
```

### AMD-模块加载器

> 独立下载版本已用 UMD 包装，因此它们可以直接用作 AMD 模块。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>test</title>
</head>
<body>
<div id="map"></div>
<script src="../dist/ol3Echarts.js"></script>
<script >
var option = '' // 标准echarts配置
var echartslayer = new ol3Echarts(map);
echartslayer.chart.setOption(option);
</script>
</body>
</html>
```

### ES6方式引入

```javascript
import ol3Echarts from '../dist/ol3Echarts.js'
```

## 使用方法

> 示例目录demo

## 截图示例
![散点图](https://raw.githubusercontent.com/sakitam-fdd/ol3Echarts/master/asset/images/rr.png)

![公交路线](https://raw.githubusercontent.com/sakitam-fdd/ol3Echarts/master/asset/images/bus.gif)

其他示例请自己挖掘

## 参考

>[https://github.com/ecomfe/echarts](https://github.com/ecomfe/echarts)