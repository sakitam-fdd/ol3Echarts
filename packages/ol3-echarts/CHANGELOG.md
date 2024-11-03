- 🐞 修复

## 3.0.1

### Patch Changes

- [`70cc98d`](https://github.com/sakitam-fdd/ol3Echarts/commit/70cc98dac78664c988c6f4b0dd3c6c45681d4e98) Thanks [@sakitam-fdd](https://github.com/sakitam-fdd)! - update build flow
- 🌟 新增
- 💄 修改
- 📖 发布
- 📝 重构
- 🗑 移除
- 🙅 废弃

## 1.3.6 (2018.12.22)

- 修复多地图实例问题

## 1.3.5 (2018.06.09)

- 更改项目组织方式，新增 ol package 支持
- 新增 react 示例

## 1.3.4 (2018.06.09)

- 新增增量数据渲染实现, 添加事件。

## 1.3.3 (2018.03.04)

- 新增 `echarts` 提供的 `map` 类型的 `GeoJSON` 数据解析。

## 1.3.2 (2018.02.01)

- 修复了 [windy-layer](https://github.com/sakitam-fdd/wind-layer)叠加时丢失动画效果。
- 新增 `forcedPrecomposeRerender` 参数，主要可以控制echarts图层是否无滞后跟随（会造成大量重绘，必要时可以开启）。

## 1.3.1 (2018.01.05)

- 兼容了极少的 `echarts-gl`图表类型。
- 添加了饼图，柱状图兼容。

## 1.3.0 (2017.12.02)

- 图层初始化：可以在任意时间初始化echarts图层，不需要再手动监听地图是否渲染后在初始化，适应更多场景。
- 添加到地图：不需要再初始化时传入地图对象，可以在地图初始化后再 `appendTo` 到地图, 并且
  渲染是在添加到地图后且存在echarts图层配置才会渲染，减少内存开销。
- 优化了echarts配置，不需要再强制传入 coordinateSystem 字段。
- 新增了四个参数，详见 `api`, 可增强用户体验，减少卡顿。

## 1.2.0 (2017.11.22)

- 修复相关bug，优化相关代码。
- 添加api文档，升级npm包版本。
- 添加 EPSG4326 投影示例。

## 1.1.0 (2017.07.26)

- 重构相关方法，webpack打包构建。
- 更新LICENSE，去除ol依赖。
- 添加相关示例。

## 1.0.0 (2017.02.01)

- 实现基础功能
