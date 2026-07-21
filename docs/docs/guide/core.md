---
id: core
title: 实现原理
sidebar_label: 实现原理
slug: /core
description: ol-echarts 坐标系统、重绘与事件桥接的实现原理
---

## 两个渲染系统如何协作

`ol-echarts` 不把 ECharts 图形转成 OpenLayers Feature，也不把 Canvas 合并到底图图层。它在 OpenLayers 的 overlay 容器中创建一个与地图同尺寸的 ECharts 容器，让两套渲染系统各自负责擅长的部分：

- OpenLayers 负责地图视图、投影、底图与地图交互；
- ECharts 负责 series 布局、视觉编码、Tooltip、Label 和命中检测；
- `ol-echarts` 负责坐标换算、生命周期和视图事件同步。

```text
业务 option
    │
    ├─ scatter / lines / custom ─→ 自定义 OpenLayers coordinateSystem
    │                                  │
    └─ pie / bar / line + coordinates ─┘
                                       ↓
                            map.getPixelFromCoordinate
                                       ↓
                              ECharts / zrender
```

## 容器与生命周期

图层默认插入 `map.getOverlayContainer()`；启用 `stopEvent` 时改用 `map.getOverlayContainerStopEvent()`。容器在地图尺寸变化时同步 width/height，ECharts 实例只创建一次。

```ts
const layer = new EChartsLayer(option);
layer.appendTo(map); // 创建容器、绑定事件、初始化 ECharts
layer.remove();      // dispose、移除 DOM、解绑 Map/View 事件
```

同一实例可以再次 `setMap(nextMap)`。切换时会先从旧地图解绑监听，再移动容器并为新地图注册独立的坐标系 ID，避免旧 Map 继续触发重绘。

## 坐标系注册

每个图层实例使用唯一名称注册 ECharts coordinate system。普通地理系列没有显式指定其他坐标系时，库会注入这个 ID；调用方已经设置的 `coordinateSystem` 不会被覆盖。

核心正向换算：

```ts
const projected = transform(data, source, destination);
const pixel = map.getPixelFromCoordinate(projected);
return [pixel[0] - offset[0], pixel[1] - offset[1]];
```

- `source` 默认 `EPSG:4326`；
- `destination` 默认使用 Map View 的投影；
- offset 由 ECharts roam 接口提供。

反向 `pointToData` 先调用 `map.getCoordinateFromPixel`，再从 `destination` 转回 `source`，因此 `convertFromPixel` 得到的仍是业务数据投影。

## 特殊图表的地图锚点

`pie` 没有地理坐标系概念，`bar` / `line` 通常依赖 grid。库用扩展字段 `coordinates` 提供地图锚点：

```ts
{
  type: 'pie',
  coordinates: [116.4, 39.9],
  radius: 28,
}
```

- pie：地图像素写入 `series.center`；
- bar / line：根据 `xAxisIndex`、`yAxisIndex` 和 `gridIndex` 找到对应 grid，再计算 `left/top`；
- grid 的数字宽高按像素处理，百分比按地图容器尺寸换算。

换算发生在 option 的副本上，不会把像素位置写回调用方对象。`formatter`、`renderItem` 等函数会保持原引用。

## 重绘策略

以下变化会更新容器或重新设置 option：

| 来源 | 行为 |
| --- | --- |
| `change:size` | 更新容器尺寸并 resize |
| `change:center` | 重新计算像素坐标 |
| `change:resolution` / `moveend` | 完成缩放并重绘 |
| `change:rotation` / `moveend` | 完成旋转并重绘 |
| `forcedPrecomposeRerender` | 在每个 `prerender` 帧同步重绘，开销较高 |

`forcedRerender` 会在 setOption 前执行 `chart.clear()`，只建议用于无法正确合并 option 的场景。默认路径复用 ECharts 实例与 option diff。

`hideOnMoving`、`hideOnZooming`、`hideOnRotating` 可在交互期间临时隐藏容器。它们不会覆盖用户通过 `setVisible(false)` 设置的状态。

## 为什么不做通用 graphic 裁剪

一个地理锚点不足以描述最终图形范围：pie 有 radius，label 依赖字体和 formatter，custom / markPoint / WebGL 系列还有独立布局。最终包围盒只有 ECharts 布局阶段知道。

因此桥接层不遍历 zrender graphic tree 强制添加 clipPath。Issue #62 采用更小的修复面：pie 锚点离开视口时隐藏 label 与 labelLine；Tooltip 使用 ECharts 的 `confine`。详见[常见问题与排查](./troubleshooting.md)。

## 增量数据

`appendData` 会复制传入的数组或 TypedArray，并可缓存 payload 以便地图重绘后恢复。`setChartOptions` 会清空旧增量缓存，避免把旧 series 数据追加到一组新的 option。

```ts
layer.appendData({
  seriesIndex: 0,
  data: nextChunk,
});
```
