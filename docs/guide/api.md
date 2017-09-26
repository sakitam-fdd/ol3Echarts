### 如何使用

> 注意：现有echarts扩展是独立于openlayers图层的，所以不可以用
  openlayers图层的方式操作。

```javascript
var option = {} // echarts标准配置
var echartslayer = new ol3Echarts(Maps.map, params);
echartslayer.chart.setOption(option);
```

#### 注意 1

> echarts配置中的 `series` 配置的 `coordinateSystem` 必须传入 `openlayers`

#### 注意 2

> 创建 ``echartslayer`` 对象必须要在地图初始化完成开始渲染后，即存在 `ol.Map` 实例

```bash
Maps.map instanceof ol.Map // true
```

#### 注意 3

> 配置

```javascript
params = {
  target: '.ol-overlaycontainer',
  source: '',
  destination: ''
}
```

配置项说明

| 配置项 | 简介 | 类型 | 备注 |
| --- | --- | --- | --- |
| target | echarts图层的父容器 | `String` or `Object` | 传入的为 `className` or `id` or `TagName`, 不传时默认放入地图容器 |
| source | 数据源投影 | `String` | 投影系 `code` 常用 EPSG:4326, EPSG:3857 |
| destination | 数据目标投影 | `String` | 渲染数据的目标投影，不传时从地图视图获取 |

