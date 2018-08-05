### 如何使用

> 注意：现有echarts扩展是独立于openlayers图层的

#### 初始化echarts图层并添加到地图

```javascript
var option = {} // echarts标准配置
var echartslayer = new ol3Echarts(null, {
    hideOnMoving: true,
    hideOnZooming: true
  });
echartslayer.appendTo(map);
```

#### 注意 1

> 创建 ``echartslayer`` 对象必须要在地图初始化完成开始渲染后，即存在 `ol.Map` 实例

```bash
Maps.map instanceof ol.Map // true
```

#### 注意 3

> 配置

```javascript
params = {
  target: '',
  source: '',
  destination: '',
  forcedRerender: false,
  hideOnZooming: false, // when zooming hide chart
  hideOnMoving: false, // when moving hide chart
  hideOnRotating: false, // // when Rotating hide chart
}
```

配置项说明

| 配置项 | 简介 | 类型 | 备注 |
| --- | --- | --- | --- |
| target | echarts图层的父容器 | `String` or `Object` | 传入的为 `className` or `id` or `TagName`, 不传时默认放入地图容器 |
| source | 数据源投影 | `String` | 投影系 `code` 常用 EPSG:4326, EPSG:3857 |
| destination | 数据目标投影 | `String` | 渲染数据的目标投影，不传时从地图视图获取 |
| forcedRerender | 是否开启强制重新渲染 | `boolean` | 默认 `false`, 注意开启后可能会造成性能损失，建议不开启。 |
| forcedPrecomposeRerender | 是否在地图渲染之前刷新echarts图层 | `boolean` | 默认 `false`, 注意开启后可以保证图层无滞后，但是会造成大量重绘，不建议开启。 |
| hideOnZooming | 缩放时是否隐藏 | `boolean` | 默认 `false`, 注意开启后会提升性能和用户体验 |
| hideOnMoving | 拖动时是否隐藏 | `boolean` | 默认 `false`, 注意开启后会提升性能和用户体验 |
| hideOnRotating | 旋转时是否隐藏 | `boolean` | 默认 `false`, 注意开启后会提升性能和用户体验 |

### 事件

``` js
echartslayer.on('redraw', function (event) {
  console.log(this, event)
});
```

支持的事件系统如下：

| 事件名 | 简介 | 类型 | 备注 |
| --- | --- | --- | --- |
| redraw | 图层重新渲染事件 | `String` | 注意：因为耦合原因, 每次重绘事件可能不只触发一次 |
| change:size | 地图大小变化事件 | `String` | -- |
| zoomend | 地图缩放结束事件 | `String` | -- |
| change:rotation | 地图旋转角度变化事件 | `String` | -- |
| movestart | 地图拖拽开始事件 | `String` | -- |
| moveend | 地图拖拽结束事件 | `String` | -- |
| change:center | 地图中心点变化事件 | `String` | -- |
