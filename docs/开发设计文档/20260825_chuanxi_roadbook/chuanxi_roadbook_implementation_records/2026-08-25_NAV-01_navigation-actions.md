# 工作包 NAV-01：地图导航与复制退化

## 基本信息

- 日期：2026-08-25
- 状态：已完成
- 对应执行计划工作包：NAV-01

## 本次实现内容

- 将公路段外链升级为高德 HTTPS URI，使用结构化 URL API 编码中文地点与多个途经点，并保留 App 未安装时的 Web 页面。
- 为每日路书和行中首页增加“复制路线”，文本包含起点、依序途经点、终点、公开搜索词和不替代实时导航提示。
- 为所有观景点与走廊增加复制退化；走廊保留起止标签和乘客观察提示，停车入口说明保留顺 / 返程信息，并固定提示错过入口继续前行。
- 为已核准 P0 / P1 精确点建立坐标导航模型；真实数据仍无核准入口，因此页面当前不显示任何停车导航。
- Clipboard API 不可用时退化到临时只读文本域复制；离线时继续保留复制操作。

## 修改文件

- `lib/navigation/map-links.ts`
- `lib/navigation/map-links.test.ts`
- `features/navigation/copy-action.tsx`
- `features/itinerary/day-guide.tsx`
- `features/itinerary/itinerary-model.test.ts`
- `features/trip/on-trip-dashboard.tsx`
- `features/scenic/scenic-detail-panel.tsx`
- `features/scenic/scenic-workspace.tsx`
- `features/scenic/scenic-model.ts`
- `features/scenic/scenic-model.test.ts`
- `lib/trip/types.ts`
- `lib/trip/schema.ts`
- `lib/trip/scenic-schema.test.ts`
- `package.json`

## 接口或数据结构变化

- `GeoRef.kind === "exact"` 新增强制字段 `coordinateSystem: "gcj02"`，避免把 WGS84 等坐标误传给高德导航。
- 新增高德搜索 URI、精确坐标导航 URI、路段复制文本和观景复制文本纯函数。
- `getParkingNavigationTarget()` 仅为 P0 / P1、`verified`、`exact` 且存在核准入口查询词的条目返回坐标导航目标。
- 导航和复制内容只包含公开地点、路线和核准坐标，不读取或持久化实时位置。

## 验证结果

执行命令：

```text
corepack pnpm --version
corepack pnpm test
corepack pnpm exec tsc --noEmit
corepack pnpm lint
corepack pnpm build
git diff --check
```

结果：

- pnpm 版本为 `8.7.0`；53/53 单元测试通过，覆盖中文 / 多途经点编码、空文本、非法坐标、GCJ-02、同名入口坐标消歧、走廊与路线复制，以及停车导航权限。
- TypeScript、ESLint、production build 和 `git diff --check` 通过；22 个页面完成构建，`pnpm-lock.yaml` 保持 v6 且未修改。
- production 服务下完成 390 x 844、768 x 1024、1440 x 1000 浏览器验收，无横向溢出。
- 每日 D3 与行中 D1 的高德 URI 编码、复制按钮和成功反馈通过；D0 不生成公路导航。
- `/scenic?day=D3` 观景复制通过，真实 43 个条目均无“导航到核准入口”。

## 未完成事项

- 真实 P0 / P1 入口坐标与方向尚待 CONTENT-03 在 D-7 / D-3 复核；在此之前不能人为补齐停车导航。
- App 唤起结果受设备、浏览器和高德安装状态影响，Web URI 与复制路线是固定退化路径。

## 下一步建议

- 进入 OFFLINE-01，缓存核心路书、D0-D9 每日页和清单参数 URL，并实现内容版本与更新提示。
- 用真实飞行模式验证已访问页面、冷启动、更新和外部地图隐藏，避免只验收 PWA 安装外壳。
