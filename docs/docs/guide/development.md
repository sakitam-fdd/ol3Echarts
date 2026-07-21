---
id: development
title: 开发与维护
sidebar_label: 开发与维护
slug: /development
description: ol-echarts 仓库结构、核心约束和验证流程
---

## 仓库结构

| 目录 | 作用 |
| --- | --- |
| `packages/ol-echarts` | OpenLayers 7–10 主包，新功能和修复优先落在这里 |
| `packages/ol3-echarts` | OpenLayers 3/4 兼容包，仅维护可安全回移的问题 |
| `docs/docs` | Docusaurus 文档源文件 |
| `docs/static/examples` | 可独立打开的 CDN 示例 |
| `.github/workflows` | 校验、文档部署和发布流程 |

## 本地环境

项目使用 Node 24 和 pnpm 10。准确版本分别以 `.nvmrc`、根目录 `package.json#packageManager` 为准。

```bash
pnpm install --frozen-lockfile
pnpm check
```

完整检查依次执行 lint、单元测试、包构建和文档构建。开发时可运行单包测试：

```bash
pnpm --filter ol-echarts test-only
pnpm --filter ol3-echarts test-only
```

## 核心数据流

```text
ECharts series 数据
        ↓ source → destination 投影
OpenLayers Coordinate
        ↓ map.getPixelFromCoordinate
ECharts 自定义 coordinateSystem
        ↓ series layout / zrender
Canvas / SVG 图形与交互
```

`scatter`、`effectScatter`、`lines` 等系列会被注入每个图层实例独有的坐标系 ID。`pie`、`bar`、`line` 使用扩展字段 `coordinates`，在每次视图更新时把地图锚点换算为 `center` 或 `grid.left/top`。

## 维护约束

- ECharts option 经常包含 `formatter`、`renderItem` 等函数，不能用 JSON 序列化复制。
- 图层支持从一个 Map 移到另一个 Map；切换前必须解除旧 Map 和 View 的监听。
- `setVisible(false)` 是用户状态，地图交互结束不能擅自恢复显示。
- `pointToData` 是 `dataToPoint` 的逆运算，必须从地图投影转换回 `source`。
- 通用裁剪属于 ECharts 布局层。桥接层只对已知的地图锚点问题做保守处理，详见[常见问题](./troubleshooting.md)。
- `dist`、`docs/docs/typedoc`、`docs/build` 都是生成物，不要直接修改。

## 新增修复的最低要求

1. 用失败测试复现问题，jsdom 地图显式调用 `map.setSize()`。
2. 修改主包；如果旧包存在同一问题，再评估兼容回移。
3. 更新类型、README 或指南中的相关行为。
4. 运行 `pnpm check`，依赖变更还需确认 `pnpm install --frozen-lockfile` 可执行。
