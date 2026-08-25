# 工作包 FE-02：行程时间线与每日页

## 基本信息

- 日期：2026-08-25
- 状态：已完成
- 对应执行计划工作包：FE-02

## 本次实现内容

- 实现 `/itinerary` D0-D9 完整时间线，展示每日唯一主目标、里程、驾驶、住宿与强度，并集中呈现 B / C 方案触发条件。
- 静态生成 `/days/D0` 至 `/days/D9`，提供路线段、公开地图搜索、必做 / 可选 / 不做、住宿海拔、前后日导航和无公路路段退化。
- 从 `Trip` 与 `ScenicCatalog` 派生当日里程、驾驶时间、停车拍照预算、超时降级动作和按路线排序的观景摘要。
- D5 使用 `ScenicDayPlan.reuse` 引用 D3 候选，保留“最多补拍 2 个”约束，不复制事实数据。
- 为每日页提供 `/scenic?day=D*` 按日只读清单，避免 FE-02 期间出现死链；路线带、筛选和详情同步留给 VIEW-01。
- 首页 D0-D9 节点接入每日页，全局导航增加“行程”入口。

## 修改文件

- `app/itinerary/page.tsx`
- `app/days/[dayId]/page.tsx`
- `app/scenic/page.tsx`
- `features/itinerary/*`
- `features/trip/planning-dashboard.tsx`
- `lib/navigation/map-links.ts`
- `config/site.ts`
- `app/about/page.tsx`
- `package.json`
- `docs/开发设计文档/20260825_chuanxi_roadbook/chuanxi_roadbook_final_design.md`
- `docs/开发设计文档/20260825_chuanxi_roadbook/chuanxi_roadbook_execution_plan.md`
- 本实施记录

## 接口或数据结构变化

- 新增 `DayItinerary` 只读 view model 和 `buildDayItinerary()` / `getScenicItemsForDay()` 纯函数。
- 新增 `createAmapSearchUrl()`，只生成经标准 URL API 编码的公开 Web 搜索链接，不声称是设备导航深链。
- `pnpm test` 扩展为执行 `features/itinerary/*.test.ts`，覆盖前后日、D5 复用、D3 / D5 / D9 预算与地图查询编码。

## 验证结果

执行命令：

```text
pnpm test
./node_modules/.bin/tsc --noEmit
./node_modules/.bin/eslint .
./node_modules/.bin/prettier --check app/itinerary app/days app/scenic app/about/page.tsx config/site.ts features/itinerary features/trip/planning-dashboard.tsx lib/navigation package.json
pnpm build
git diff --check
```

结果：

- 全部 28 项测试通过，其中 FE-02 行程 view model 与地图 URL 测试 5 项。
- TypeScript、ESLint、scoped Prettier 和 `git diff --check` 通过。
- production build 通过，`/itinerary` 静态生成，`/days/D0` 至 `/days/D9` 通过 `generateStaticParams` 生成。
- 1440 × 1000、768 × 1024、390 × 844 下导航、时间线和每日页无页面级横向溢出，深色模式通过浏览器验收。
- D3 / D5 / D9 停车预算和超时改车览规则可见；D0 / D4 / D8 无公路路段状态、前后日切换与 D5 返程补拍列表已实测。
- 地图链接仅检查生成的外部 URL，验收中未跳转或传输其他数据。
- pnpm 仍为 8.7.0，lockfile 仍为 v6，本工作包没有增加依赖。
- 验收用 3100 端口服务已在本记录完成前关闭。

## 未完成事项

- `/scenic` 当前只是按日只读清单，尚无路线带、筛选、详情面板和选中态同步。
- 公开地图搜索链接尚无设备级深链、复制退化和 App 不可用处理。
- 所有 P0 / P1 观景点仍需在 D-7 完成坐标、入口方向和停车状态复核，当前不提供停车导航。
- 当前日推导和行前 / 行中模式切换属于 FE-04。

## 下一步建议

- 实施 `VIEW-01` 观景路线可视化，在现有 `/scenic?day=D*` 入口上增加路线带、筛选和列表 / 详情选中同步。
