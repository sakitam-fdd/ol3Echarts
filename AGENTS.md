# Repository guide for coding agents

## Scope and package matrix

This is a pnpm monorepo with two published packages and one Docusaurus site.

| Path | Purpose | Compatibility |
| --- | --- | --- |
| `packages/ol-echarts` | Primary package; modular `ol` integration | OpenLayers 7–10, ECharts 5/6 |
| `packages/ol3-echarts` | Legacy compatibility package | `openlayers` 3/4 |
| `docs` | Documentation and runnable examples | Docusaurus 3 |

Prefer changes in `packages/ol-echarts`. Port bug fixes to `ol3-echarts` only when the same runtime behavior exists and the legacy API can support the fix without a breaking change.

## Core invariants

- Never mutate caller-owned ECharts options. Options may contain functions, typed arrays and circular plain objects; JSON serialization is not a valid clone strategy.
- A layer may be moved between maps. Detach listeners from the previous map before binding the next map.
- User visibility (`setVisible`, `show`, `hide`) must win over temporary `hideOnMoving`, `hideOnZooming` and `hideOnRotating` states.
- `dataToPoint` transforms from `source` to the map projection. `pointToData` must perform the inverse transform.
- Do not implement generic graphic clipping in the bridge. ECharts owns series layout. For the Issue #62 case, suppress offscreen pie labels/label lines using the geographic anchor and document `tooltip.confine` / series-level `clip` where applicable.
- Preserve an explicitly configured ECharts `coordinateSystem` or `animation` value. Only inject defaults when a value is absent.
- Dispose ECharts instances, remove DOM nodes and unbind all OpenLayers listeners in `remove()`.

## Commands

Use Node 24 and the pnpm version declared in `package.json`.

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm test-only
pnpm build
pnpm docs:build
```

`pnpm check` runs the complete sequence. For focused work:

```bash
pnpm --filter ol-echarts test-only
pnpm --filter ol3-echarts test-only
pnpm --filter ol-echarts lint
```

Add regression tests for every core bug. Prefer deterministic map events and explicit `map.setSize()` in jsdom; avoid timer-driven animation tests.

## Files and generated output

- Edit TypeScript in `packages/*/src`; do not edit `packages/*/dist`.
- `docs/docs/typedoc`, `docs/.docusaurus`, `docs/build`, coverage output and Turbo caches are generated and ignored.
- Runnable CDN examples live in `docs/static/examples`. Pin CDN versions and use HTTPS.
- Public guides live in `docs/docs/guide`; update them when options, compatibility or runtime behavior changes.
- Keep `pnpm-lock.yaml` synchronized with every dependency change and use a frozen lockfile in CI.

## CI and release safety

- CI must run for both pushes and pull requests, with read-only permissions unless a job deploys or releases.
- Keep setup in `.github/setup/action.yml`; do not install browser binaries unless a test actually uses browser mode.
- Pin third-party actions to released major tags, never a moving `master` branch.
- Do not publish or deploy from pull request workflows. Changesets owns versioning and npm publication.

See [development.md](docs/docs/guide/development.md) for the architecture and maintenance workflow, and [troubleshooting.md](docs/docs/guide/troubleshooting.md) for rendering edge cases.
