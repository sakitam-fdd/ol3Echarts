# 贡献指南

感谢你改进 ol-echarts。提交前请先搜索已有 Issue，并在 Bug 报告中提供：包版本、OpenLayers / ECharts 版本、浏览器、最小复现和预期行为。

## 开发环境

- Node.js 24（最低支持 22）
- pnpm 版本以根目录 `package.json#packageManager` 为准

```bash
git clone https://github.com/sakitam-fdd/ol3Echarts.git
cd ol3Echarts
corepack enable
pnpm install --frozen-lockfile
pnpm check
```

常用的聚焦命令：

```bash
pnpm --filter ol-echarts test-only
pnpm --filter ol-echarts lint
pnpm docs:dev
```

## 修改原则

- 新功能与现代 OpenLayers 修复优先修改 `packages/ol-echarts`。
- 只有同一问题确实存在且不会破坏旧 API 时，才同步到 `packages/ol3-echarts`。
- 核心 Bug 必须有回归测试；jsdom 地图需显式设置尺寸，避免依赖计时器动画。
- API、默认值或兼容范围变化时，同步更新 README、类型和 `docs/docs/guide`。
- 不要修改 `dist`、TypeDoc 输出、文档 build、coverage 或 Turbo cache。
- 依赖变化必须提交同步更新的 `pnpm-lock.yaml`。

更完整的实现约束见 [AGENTS.md](./AGENTS.md) 和[开发与维护文档](./docs/docs/guide/development.md)。

## Pull Request

PR 请说明问题、方案、兼容性影响与已执行的验证命令。建议使用清晰的 Conventional Commit 风格标题，例如：

```text
fix: suppress offscreen pie label lines
docs: refresh troubleshooting guide
ci: validate supported Node LTS versions
```

版本由 Changesets 管理。影响发布包时，请按维护者要求补充 changeset；不要手工编辑生成的 changelog。
