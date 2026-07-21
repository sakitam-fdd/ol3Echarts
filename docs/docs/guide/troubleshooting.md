---
id: troubleshooting
title: 常见问题与排查
sidebar_label: 常见问题
slug: /troubleshooting
description: 排查 ol-echarts 的越界标签、Tooltip、投影和交互问题
---

## 饼图移出视口后出现超长引导线

这是 `issues.md` 分析的 Issue #62 场景。`pie.labelLine` 由 ECharts 在布局阶段根据圆心、标签文本、字体和设备像素比计算，桥接层无法在坐标转换阶段得到最终图形包围盒。

`ol-echarts` 默认启用以下保守处理：当 `pie.coordinates` 对应的锚点完全位于地图视口外时，仅隐藏该次渲染的 `label` 与 `labelLine`，不修改调用方 option，也不裁剪仍可能部分可见的饼图。

```ts
const layer = new EChartsLayer(option, {
  hideOffscreenLabels: true, // 默认值
});
```

如需完全交由 ECharts 布局，可关闭它：

```ts
const layer = new EChartsLayer(option, {
  hideOffscreenLabels: false,
});
```

## Tooltip 越出地图容器

Tooltip 和饼图引导线不是同一个问题。优先使用 ECharts 自身的约束：

```ts
const option = {
  tooltip: {
    trigger: 'item',
    confine: true,
  },
};
```

部分系列还支持 `series.clip = true`。不要在 `ol-echarts` 中对所有 zrender graphic 强行增加 `clipPath`，因为 custom、markPoint、富文本标签和 WebGL 系列的布局边界各不相同。

## 图形位置错误或 `pointToData` 返回墨卡托坐标

确认 `source` 是数据坐标的投影，而不是底图投影。未配置时数据默认按 `EPSG:4326` 处理，目标投影默认来自 Map View。

```ts
new EChartsLayer(option, {
  source: 'EPSG:4326',
  // destination 通常无需填写
});
```

自定义投影需先通过 OpenLayers 或 proj4 注册，否则 `transform` 会抛出未知投影错误。

## 地图交互时图层一直隐藏

`hideOnMoving`、`hideOnZooming`、`hideOnRotating` 是临时状态；`setVisible(false)` 是用户状态，优先级更高。若交互结束后仍隐藏，先确认业务代码没有调用 `hide()` 或 `setVisible(false)`。

```ts
layer.setVisible(true);
console.log(layer.isVisible());
```

## bar / line 没有围绕地图锚点居中

坐标锚定的笛卡尔图表需要明确的 grid 宽高。数字按像素处理，百分比相对地图容器处理。

```ts
const option = {
  grid: { width: 120, height: 80 },
  series: {
    type: 'bar',
    coordinates: [116.4, 39.9],
    data: [12, 20, 15],
  },
};
```

## 在两个 Map 之间移动图层

直接再次调用 `setMap` 或 `appendTo`。图层会解绑旧 Map 的监听、移动容器并重新注册实例坐标系。

```ts
layer.appendTo(firstMap);
layer.setMap(secondMap);
```

生命周期结束时必须调用 `remove()`，以释放 ECharts、DOM 和 OpenLayers 监听器。
