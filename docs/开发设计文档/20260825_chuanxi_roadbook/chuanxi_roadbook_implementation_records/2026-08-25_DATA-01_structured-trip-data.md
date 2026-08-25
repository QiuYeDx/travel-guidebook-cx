# 工作包 DATA-01：结构化行程与来源模型

## 基本信息

- 日期：2026-08-25
- 状态：已完成
- 对应执行计划工作包：DATA-01

## 本次实现内容

- 建立 `Trip`、`TripDay`、`RouteLeg`、`SourceRef`、`FallbackTrigger` 和 B/C 方案类型。
- 将攻略 v0.2 的 D0-D9 日期、路线、住宿、强度、主目标、执行项和降级条件迁移到 `trip.ts`。
- 将 7 个已核实来源、freshness、`verifiedAt` 和季节来源 `reviewAt` 迁移到 `sources.ts`。
- 建立纯 TypeScript 数据校验器，覆盖日期、ID、引用、复核时间、数值范围和方案完整性。
- 增加 `test:data`，用 7 项测试覆盖合法基线和主要失败分支。

## 修改文件

- `data/trips/2026-chuanxi/trip.ts`
- `data/trips/2026-chuanxi/sources.ts`
- `lib/trip/types.ts`
- `lib/trip/schema.ts`
- `lib/trip/schema.test.ts`
- `package.json`
- `pnpm-lock.yaml`
- `docs/开发设计文档/20260825_chuanxi_roadbook/chuanxi_roadbook_final_design.md`
- `docs/开发设计文档/20260825_chuanxi_roadbook/chuanxi_roadbook_execution_plan.md`
- 本实施记录

## 接口或数据结构变化

- `chuanxiTrip` 是 D0-D9 主线 A 与 B/C 降级方案的结构化事实源。
- `chuanxiSources` 是当前 7 个版本化来源的结构化事实源。
- `assertValidTrip()` 在导入数据模块时执行；`validateTrip()` / `validateSources()` 可供测试和后续构建工具复用。
- B 方案包含 9 月 30 日至 10 月 6 日的替代日程；C 方案保留固定安全优先级，不伪造临时路线。
- 动态天气、道路、排队和充换电站未写入静态数据，继续由 D-7 / D-3 / 每晚复核。

## 验证结果

执行命令：

```text
pnpm test:data
./node_modules/.bin/tsc --noEmit
./node_modules/.bin/eslint .
./node_modules/.bin/prettier --check lib/trip data/trips/2026-chuanxi package.json
pnpm build
head -8 pnpm-lock.yaml
pnpm --version
```

结果：

- 数据契约测试 7/7 通过。
- TypeScript、ESLint 和 Prettier 检查通过。
- Next.js 15.5.7 production build 通过，现有页面全部成功静态生成。
- 本机与项目使用 `pnpm@8.7.0`；lockfile 仍为 v6。
- 攻略总表中的 D0-D9 日期、路线标题、强度和住宿地已固化为人工对照测试。
- 本轮未启动前端服务，无需清理常驻进程。

## 未完成事项

- 观景点与走廊仍待 `DATA-02` 迁移。
- 前端尚未读取 `chuanxiTrip`；首页仍是初始化占位。
- 住宿、补能、道路和预约的动态结果仍需团队在规定节点复核。

## 下一步建议

- 实施 `DATA-02`，复用现有 schema 和测试基础设施实现观景点、观景走廊及停车导航权限校验。
