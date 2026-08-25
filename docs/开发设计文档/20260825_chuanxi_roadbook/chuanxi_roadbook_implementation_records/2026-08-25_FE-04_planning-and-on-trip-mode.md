# 工作包 FE-04：行前 / 行中模式

## 基本信息

- 日期：2026-08-25
- 状态：已完成
- 对应执行计划工作包：FE-04

## 本次实现内容

- 建立 `planning` / `onTrip` 全局模式、本机持久化和无存储退化。
- 按中国标准时间推导 D0-D9，覆盖行程前、行程中、行程后边界，并允许手动切日和恢复跟随日期。
- 实现桌面顶部模式分段控件与移动端“今天 / 行程 / 清单 / 更多”底部导航。
- 实现行中首页：当前日主目标、下一段、风险与降级动作、目标到达电量、最晚到达、住宿和当天操作。
- 将正式攻略中的 D1 / D2 / D3 / D5 / D6 / D7 / D9 目标到达 SOC 迁移到 `trip.ts` 事实源。
- 支持 `/checklists?view=daily&day=D3` 等当天清单深链，并将当前日传给观景页。

## 修改文件

- `features/trip/mode-model.ts`
- `features/trip/mode-model.test.ts`
- `features/trip/trip-mode-provider.tsx`
- `features/trip/mode-toggle.tsx`
- `features/trip/trip-home.tsx`
- `features/trip/on-trip-dashboard.tsx`
- `components/layout/mobile-trip-navigation.tsx`
- `components/layout/site-header.tsx`
- `components/layout/site-footer.tsx`
- `components/providers/app-providers.tsx`
- `app/layout.tsx`
- `app/page.tsx`
- `app/checklists/page.tsx`
- `features/checklist/checklist-workspace.tsx`
- `data/trips/2026-chuanxi/trip.ts`
- `lib/trip/schema.test.ts`

## 接口或数据结构变化

- 新增 `TripMode` / `TripModeConfig` / `TripModePreference` / `TripClockState` 类型。
- 模式存储键为 `travel-guidebook:trip-mode:<tripId>`，只保存模式与可选手动日程 ID。
- `RouteLeg.targetArrivalSoc` 现已在所有公路移动日填充攻略中的到达下限。
- `ChecklistWorkspace` 接受 `initialView` / `initialDayId`，用于服务端解析的当天深链。

## 验证结果

执行命令：

```text
corepack pnpm --version
corepack pnpm test
corepack pnpm exec tsc --noEmit
corepack pnpm lint
corepack pnpm exec prettier --write <FE-04 scoped files>
corepack pnpm build
git diff --check
```

结果：

- pnpm 版本为 `8.7.0`，`pnpm-lock.yaml` 仍为 v6 且本包未修改 lockfile。
- 单元测试 43/43 通过，覆盖 `2026-09-27 00:00 CST` 进入 D0、`2026-10-07 00:00 CST` 进入行程后状态、手动切日和偏好解析。
- TypeScript、全仓 ESLint、Prettier、production build 和 `git diff --check` 通过。
- 浏览器在 390 x 844、768 x 1024、1440 x 1000 与明暗主题下无横向溢出。
- 已验证 D3 模式 / 手动日刷新持久化、恢复跟随日期、D3 当天清单深链、移动“更多”弹层、`25%` 到达电量与控制台无错。
- 首页 production 页面 JS 为 6.57 kB，shared JS 为 204 kB（Next 构建报告未 gzip）；本包未新增依赖。

## 未完成事项

- `/checklists` 为精确服务端打开查询参数而变为动态页；OFFLINE-01 需预缓存 D0-D9 每日深链 URL。
- 开发服务在当前宿主环境遇到 `EMFILE` 文件监视上限；浏览器验收改用 production server 完成，不影响 production build。

## 下一步建议

- 进入 FE-05，实现来源目录、复核状态计算和首页到期行动提示。
- 过期必须表达为“需要重新核实”，不能表达为原结论已错。
