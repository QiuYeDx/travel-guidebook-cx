# 工作包 DATA-02：结构化观景点与走廊模型

## 基本信息

- 日期：2026-08-25
- 状态：已完成
- 对应执行计划工作包：DATA-02

## 本次实现内容

- 实现 `Viewpoint`、`ScenicCorridor`、`GeoRef`、`ParkingProfile`、`ScenicDayPlan` 和 `ScenicCatalog`。
- 将攻略 v0.2 的 43 个 `VP-*` / `SC-*` 迁移到 `viewpoints.ts`，保留路线顺序、优先级、方向、主题和来源。
- 建立 D1-D9 每日停靠策略；D4 / D8 使用景交模式，D5 通过引用复用 D3 候选且最多选择 2 个。
- 扩展 schema，校验日程 / 路段 / 来源引用、每日 sequence、GeoRef 分支和停车导航权限。
- 新增 9 项观景目录测试；`test:data` 统一运行 DATA-01 与 DATA-02 共 16 项测试。

## 修改文件

- `data/trips/2026-chuanxi/viewpoints.ts`
- `lib/trip/types.ts`
- `lib/trip/schema.ts`
- `lib/trip/scenic-schema.test.ts`
- `package.json`
- `docs/开发设计文档/20260825_chuanxi_roadbook/chuanxi_roadbook_final_design.md`
- `docs/开发设计文档/20260825_chuanxi_roadbook/chuanxi_roadbook_execution_plan.md`
- `docs/开发设计文档/20260825_chuanxi_roadbook/feat/2026-08-25_chuanxi_roadbook_scenic-stops.md`
- 本实施记录

## 接口或数据结构变化

- `chuanxiScenicCatalog.items` 保存 43 个点 / 走廊；`dayPlans` 保存 D1-D9 的停车预算和使用模式。
- `ScenicCorridor` 强制使用 `route-interval`，不能保存虚假中心坐标或停车导航。
- P2、`prohibited`、`transit-only`、`walk-only` 永远不能设置 `parkingNavigationQuery`。
- P0 / P1 只有同时具备 `GeoRef.exact` 和 `verificationStatus: verified` 才能设置停车导航。
- 当前全部命名点使用 `GeoRef.none`，明确等待 D-7 双地图坐标、入口方向与停车复核。

## 验证结果

执行命令：

```text
pnpm test:data
./node_modules/.bin/tsc --noEmit
./node_modules/.bin/eslint .
./node_modules/.bin/prettier --check lib/trip data/trips/2026-chuanxi package.json
pnpm build
rg -n '^    id: "(VP|SC)-D[0-9]-[0-9][0-9]"' data/trips/2026-chuanxi/viewpoints.ts | wc -l
```

结果：

- DATA-01 + DATA-02 数据测试 16/16 通过，其中观景目录测试 9/9。
- TypeScript、ESLint 和 scoped Prettier 检查通过。
- Next.js 15.5.7 production build 通过，现有页面全部成功静态生成。
- 共迁移 43 个目录条目，ID 无重复；测试快照与攻略 v0.2 顺序一致。
- lockfile 仍为 v6；本工作包没有增加新依赖。
- 本轮未启动前端服务，无需清理常驻进程。

## 未完成事项

- `/scenic` 路线带、筛选和详情面板尚未实现。
- 43 个条目的国庆开放、停车容量和精确入口仍需 D-7 / D-3 复核。
- 在坐标和停车状态核准前，页面只能显示地点名称、区间和安全说明，不能提供停车导航。

## 下一步建议

- 实施 `CONTENT-02`，建立攻略 Markdown 的服务端阅读管线；之后使用现有结构化数据开发行程页和 `/scenic`。
