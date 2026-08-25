# 工作包 VIEW-01：观景路线可视化

## 基本信息

- 日期：2026-08-25
- 状态：已完成
- 对应执行计划工作包：VIEW-01

## 本次实现内容

- 在 `/scenic?day=D*` 实现按真实行驶顺序呈现的路线带，使用图标、文字和实线 / 虚线边框区分停靠点与连续车览走廊。
- 实现优先级、停车等级、拍摄对象、行驶方向和复核状态五类筛选，保持筛选后顺序稳定。
- 路线带、结果列表和详情面板共享稳定条目 ID，触屏、鼠标或键盘激活原生按钮均会同步 `aria-pressed` 和 URL `item` 参数。
- 详情面板展示方向、停留、位置表达、停车结论、入口 / 容量、拍摄对象与来源复核日期。
- D5 明确标注“源自 D3 返程补拍”，保留最多 2 次停靠预算。
- 筛选结果为空时同时退化路线带、列表与详情，并提供清除筛选操作。
- 使用 `useSyncExternalStore` 订阅在线状态；离线时保留路线、详情和地名文本，停用来源与外部地图链接。
- 建立停车导航资格纯函数，只允许“P0 / P1 + exact + verified + 核准查询词”显示公开地图搜索；当前 43 个条目均不满足，因此不显示停车导航。

## 修改文件

- `app/scenic/page.tsx`
- `features/scenic/*`
- `features/itinerary/scenic-day-index.tsx`
- `package.json`
- `docs/开发设计文档/20260825_chuanxi_roadbook/chuanxi_roadbook_final_design.md`
- `docs/开发设计文档/20260825_chuanxi_roadbook/chuanxi_roadbook_execution_plan.md`
- 本实施记录

## 接口或数据结构变化

- 新增 `ScenicFilters`、`filterScenicItems()`、`resolveSelectedScenicItem()`、`getAvailableSubjects()` 和 `getParkingNavigationQuery()` 纯函数。
- `/scenic` 新增可选 `item` 查询参数，用于稳定 ID 选中态；筛选本身不持久化。
- `pnpm test` / `test:features` 扩展为执行 `features/scenic/*.test.ts`。

## 验证结果

执行命令：

```text
pnpm test
./node_modules/.bin/tsc --noEmit
./node_modules/.bin/eslint .
./node_modules/.bin/prettier --check app/scenic features/scenic features/itinerary/scenic-day-index.tsx package.json
pnpm build
git diff --check
```

结果：

- 全部 33 项测试通过，其中 VIEW-01 筛选、方向、主题、选中回退和导航资格测试 5 项。
- TypeScript、ESLint、scoped Prettier、production build 和 `git diff --check` 通过。
- `/scenic` 页面自身 JavaScript 为 35.8 kB，未新增依赖。
- 1440 × 1000、768 × 1024、390 × 844 下日程控件、横向筛选、路线带、详情和列表无页面级横向溢出，深色模式通过浏览器验收。
- 组合筛选、空结果清除、路线带 / 列表 / 详情同步、URL 条目 ID、D5 复用和禁停 / 景交 / 步行无停车导航均已实测。
- 服务端 HTML 包含完整路线、详情和乘客操作提示，核心阅读不依赖筛选客户端完成后才出现。
- 当前浏览器控制环境未提供网络断开模拟，因此离线事件 UI 仅完成实现审查；完整飞行模式验收留给 OFFLINE-01。
- pnpm 仍为 8.7.0，lockfile 仍为 v6，本工作包没有增加依赖。
- 验收用 3100 端口服务已在本记录完成前关闭。

## 未完成事项

- 行中模式默认今天、前后日快速切换和模式持久化属于 FE-04。
- 设备级地图深链、复制地名退化和 App 不可用处理属于 NAV-01。
- P0 / P1 坐标、入口方向和停车状态仍需在 D-7 / D-3 完成内容复核。
- PWA 缓存、首次在线后飞行模式读取和更新提示属于 OFFLINE-01。

## 下一步建议

- 实施 `FE-03` 清单与安全页，先建立版本化清单合并 / 持久化纯函数，再完成移动端出发和收车工作流。
