# 工作包 ROUTE-RESET-02：成都 7 天大环线与完整每日总览

## 基本信息

- 日期：2026-09-02
- 状态：已完成
- 对应执行计划工作包：ROUTE-RESET-02、QA-02

## 本次实现内容

- 将正式攻略从深圳往返 10 天短环线整体重置为成都起止 7 天大环线。
- 用结构化数据固化 D1—D7 的日期、路线、里程、车程、海拔、住宿、时间轴、观星和降级动作。
- 重建 30 个观景条目与 D1—D7 停靠预算。
- 首页删除必须跳转才能继续阅读的粗略每日卡片，改为直接展开的完整每日总览。
- 每日页同步显示时间轴、海拔剖面与观星计划；行程、观景、metadata 和项目说明统一到 v2。
- 为亚丁政策记录政府来源，把鱼子西预约、收费、通行与月出保留为待复核 / 估算。

## 修改文件

- 正式内容：`content/guidebook/2026-chuanxi-grand-loop.md`
- 数据：`data/trips/2026-chuanxi/trip.ts`、`viewpoints.ts`、`sources.ts`、`planning.ts`
- 契约：`lib/trip/types.ts`、`schema.ts`、`planning.ts`
- 前端：`features/trip/overview-dashboard.tsx`、`on-trip-dashboard.tsx`、`features/itinerary/*`
- 配置：`config/site.ts`、页面 metadata、`README.md`、`AGENT.md`
- 文档：final design、execution plan、feat 文档与本实施记录
- 测试：trip、scenic、itinerary、overview、mode 与 guidebook 相关测试

## 接口或数据结构变化

- `TripDay.dayNumber` 的正式起始编号改为 1，页面路径为 `/days/D1` 至 `/days/D7`。
- `TripDay` 新增：
  - `lunarDate`
  - `altitudeProfile`
  - `timeline`
  - `stargazing`
- 规划任务截止日允许落在行程内，但不得晚于 `trip.endDate`，以支持 D6 前三天的动态复核。

## 验证结果

执行命令：

```text
<bundled-node> node_modules/tsx/dist/cli.mjs --test ...
<bundled-node> node_modules/eslint/bin/eslint.js .
<bundled-node> node_modules/next/dist/bin/next build --turbopack
```

结果：

- 测试 49/49 通过。
- ESLint 通过。
- production build 通过，D1—D7 静态生成；总计 16 个静态 / SSG 页面。
- 390 × 844、768 × 1024、1440 × 1000 首页没有页面级横向溢出。
- `/itinerary`、`/days/D6`、`/scenic?day=D6`、`/guidebook` 在 390 px 下无横向溢出。
- 浏览器控制台无 warning / error。
- 当前环境没有 `npx`，因此使用仓库现有依赖与内置 Node 直接运行同一套 CLI；`pnpm-lock.yaml` 未修改。

## 未完成事项

- QA-DEVICE-02：至少 2 名同行者真机验收。
- CONTENT-04：住宿、亚丁、道路、鱼子西与天文天气的出发前动态复核。

## 下一步建议

- 优先关闭 6 晚住宿和成都集结方式。
- 9/22 核对亚丁预约与开放；9/26 起滚动核对道路；10/1 核对鱼子西和观星窗口。
