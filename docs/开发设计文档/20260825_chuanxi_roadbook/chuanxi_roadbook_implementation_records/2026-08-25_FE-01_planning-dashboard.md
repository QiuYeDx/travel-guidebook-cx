# 工作包 FE-01：行前总览工作台

## 基本信息

- 日期：2026-08-25
- 状态：已完成
- 对应执行计划工作包：FE-01

## 本次实现内容

- 用真实 `Trip`、`ScenicCatalog`、`SourceRef` 和行前快照替换首页占位内容。
- 建立六项待决和五项预订 / 复核任务的结构化快照，标记截止日期和“以仓库记录为准”语义。
- 实现首页汇总纯函数，从事实源派生行程天数、公路移动日、主干里程、43 个观景条目、风险与复核日期。
- 实现静态行前工作台：首屏状态、D0-D9 路线轨迹、决策列表、进度、关键降级风险与来源复核摘要。
- 桌面端一次显示完整 D0-D9；平板与手机使用受限的横向路线区域并显示方向箭头，不造成页面级溢出。
- 首页保持 Server Component 和静态生成，没有新增页面级客户端 JavaScript。

## 修改文件

- `app/page.tsx`
- `features/trip/planning-dashboard.tsx`
- `features/trip/overview-model.ts`
- `features/trip/overview-model.test.ts`
- `data/trips/2026-chuanxi/planning.ts`
- `lib/trip/planning.ts`
- `lib/trip/types.ts`
- `components/layout/site-header.tsx`
- `package.json`
- `docs/开发设计文档/20260825_chuanxi_roadbook/chuanxi_roadbook_final_design.md`
- `docs/开发设计文档/20260825_chuanxi_roadbook/chuanxi_roadbook_execution_plan.md`
- 本实施记录

## 接口或数据结构变化

- 新增 `PlanningSnapshot`、`PlanningDecision`、`PlanningTask`、`PlanningDeadline` 与 `PlanningItemStatus`。
- `assertValidPlanningSnapshot()` 校验行程归属、真实 ISO 日期、唯一 ID 与行程开始前的截止窗口。
- `buildTripOverview()` 输出首页只读 view model，不在 React 组件中重复计算事实。
- `pnpm test` 扩展为同时执行 `features/trip/*.test.ts`，并新增 `test:features`。

## 验证结果

执行命令：

```text
pnpm test
./node_modules/.bin/tsc --noEmit
./node_modules/.bin/eslint .
./node_modules/.bin/prettier --check app/page.tsx components/layout/site-header.tsx data/trips/2026-chuanxi/planning.ts features/trip lib/trip/planning.ts lib/trip/types.ts package.json
pnpm build
git diff --check
```

结果：

- 全部 23 项测试通过，其中 FE-01 汇总与截止窗口测试 2 项。
- TypeScript、ESLint、scoped Prettier 和 `git diff --check` 通过。
- production build 通过，首页成功静态生成，页面自身 JS 为 0 B，首载 JS 为 183 kB。
- 1440 × 1000 下可一次看全 D0-D9；768 × 1024 与 390 × 844 下路线在自身区域滚动，首页没有横向溢出。
- 移动端六项决策、三项关键风险、复核摘要、页脚和深色模式均完成浏览器验收；控制台无警告或错误。
- pnpm 仍为 8.7.0，lockfile 仍为 v6，本工作包没有增加依赖。
- 验收用 3100 端口服务已在本记录完成前关闭。

## 未完成事项

- 首页目前只提供行前模式，没有当前日推导或手动切换到行中模式。
- 路线节点尚未链接独立每日页，因为 FE-02 路由尚未建立。
- 行前快照中所有任务仍为“待确认”，需团队把现实进度同步回仓库后再更新。
- 完整来源状态、过期警告和单条来源详情属于 FE-05。

## 下一步建议

- 实施 `FE-02` 行程时间线与静态每日页，让首页 D0-D9 节点可进入对应的主目标、路段、风险和降级动作。
