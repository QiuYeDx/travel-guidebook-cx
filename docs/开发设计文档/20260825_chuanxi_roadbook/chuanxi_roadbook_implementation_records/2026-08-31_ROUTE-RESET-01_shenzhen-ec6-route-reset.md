# 工作包 ROUTE-RESET-01：深圳往返 EC6 路线重置

## 基本信息

- 日期：2026-08-31
- 状态：已完成
- 对应执行计划工作包：ROUTE-RESET-01、QA-01

## 本次实现内容

- 将旧路书整体重置为 2026-09-27 深圳出发、2026-10-06 返回深圳的 10 天路线。
- 将人员和车辆事实统一为 3 人、1 台蔚来 EC6、三人轮换驾驶。
- 以蔚来“川西大环线”分享页为景点骨架，保留都江堰、毕棚沟、达古冰川、塔公草原和折多山。
- 为两天返深高速留出硬余量，明确删除色达—措卡湖远端支线、成都城市景点和旧南线。
- 新增米亚罗、奶子沟、梭磨河谷、大金川河谷、雅拉雪山观景台、姑弄村候选区、新都桥十里长廊等顺路小景与车览走廊。
- 重写正式攻略、路线数据、观景数据、来源和行前决策，并同步首页、行程、每日页和观景页面文案。
- 删除没有入口且仍硬编码旧路线事实的 `features/trip/planning-dashboard.tsx`。
- 更新模型与 schema 测试，使日期、里程、天数、观景数量和路线节点都有回归保护。

## 路线结论

```text
D0  深圳 → 贵阳
D1  贵阳 → 成都外围 → 都江堰
D2  都江堰 → 汶川 → 毕棚沟 → 古尔沟
D3  古尔沟 → 米亚罗 → 奶子沟 → 黑水
D4  达古冰川景区 → 黑水
D5  黑水 → 马尔康 → 金川
D6  金川 → 丹巴 → 八美 → 塔公 → 新都桥
D7  新都桥 → 折多山 → 康定 → 雅安
D8  雅安 → 贵阳
D9  贵阳 → 深圳
```

全程按约 4,380—5,080 km 规划。D6 的观景停靠全部服从“天黑前到新都桥”；任何拥堵、天气或人员状态触发条件出现时，先取消观景，不用夜驾补回进度。

## 修改文件

- `content/guidebook/2026-chuanxi-grand-loop.md`
- `data/trips/2026-chuanxi/trip.ts`
- `data/trips/2026-chuanxi/viewpoints.ts`
- `data/trips/2026-chuanxi/planning.ts`
- `data/trips/2026-chuanxi/sources.ts`
- `features/trip/overview-dashboard.tsx`
- `features/trip/on-trip-dashboard.tsx`
- `features/itinerary/itinerary-timeline.tsx`
- `features/itinerary/day-guide.tsx`
- `app/itinerary/page.tsx`
- `app/scenic/page.tsx`
- `config/site.ts`
- 对应 `*.test.ts`
- `README.md`、`AGENT.md`、final design、execution plan 与 feat 文档

## 数据与界面变化

- 行程版本升级到 v1.0，正式天数由 D0—D12 收敛为 D0—D9。
- 观景清单调整为 D1—D9 共 37 项；没有完成入口复核的候选项不生成停车导航。
- 来源更新为 7 项，并为季节性景区、道路和交通信息保留 9/20 或 9/24 的复核日期。
- 首页显示“深圳往返川西短环线”、10 天、3 人、EC6、4,380—5,080 km 和 37 处观景条目。
- D6 页面和观景页以 8 个沿途条目展示“可停车 / 待确认 / 车览 / 禁停”的不同执行语义。

## 验证结果

由于当前沙箱没有项目固定的 `pnpm@8.7.0`，未安装或改写依赖；使用固定 Node 与仓库现有 `node_modules` 直接运行同一套本地 CLI。

执行命令：

```text
node node_modules/tsx/dist/cli.mjs --test features/itinerary/*.test.ts features/scenic/*.test.ts features/trip/*.test.ts lib/content/*.test.ts lib/navigation/*.test.ts lib/trip/*.test.ts
node node_modules/eslint/bin/eslint.js .
node node_modules/next/dist/bin/next build --turbopack
```

结果：

- 测试：45/45 通过。
- ESLint：通过，无错误。
- Production build：通过；19 个页面完成生成。
- 浏览器 QA：`/`、`/itinerary`、`/days/D0`、`/days/D6`、`/scenic?day=D6`、`/guidebook` 在 390 × 844、768 × 1024、1440 × 1000 下无横向溢出。
- 交互 QA：D6 观景详情弹层可打开、关闭，停车待确认语义完整。
- 运行日志：浏览器控制台无 warning 或 error。
- 服务清理：本轮本地 Next 服务已关闭，3000 端口无监听。

Turbopack 首次在受限沙箱内因无法创建 Node 子进程而失败；获准在沙箱外运行相同构建命令后通过，确认不是代码或类型错误。

## 未完成事项

- EC6 的具体电池版本、实时可用续航和最终补能点仍需车主在车机中确认。
- 酒店、房间方案、景区预约与动态道路状态仍处于出发前复核范围。
- P0 / P1 候选观景点仍需在 9/20 与 9/24—25 用双地图核对入口和合法停车。
- 至少 2 名同行者的真机验收尚未执行。

## 下一步建议

1. 9 月 20 日复核景区、道路、天气趋势和 EC6 补能候选。
2. 9 月 24—25 日完成停车入口、逐小时天气、离线地图与酒店收藏。
3. 出发前让两名同行者分别在手机上完成“找当天路线、查看下一处观景、打开安全页”。
