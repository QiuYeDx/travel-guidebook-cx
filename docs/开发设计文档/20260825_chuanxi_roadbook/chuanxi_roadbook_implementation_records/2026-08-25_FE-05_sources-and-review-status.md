# 工作包 FE-05：来源与复核状态

## 基本信息

- 日期：2026-08-25
- 状态：已完成
- 对应执行计划工作包：FE-05

## 本次实现内容

- 建立稳定 / 季节 / 实时来源的 `verified` / `needs-review` / `expired` 纯函数计算。
- 实现 `/sources` 静态页，展示 7 项来源的发布方、最近核实、下次复核、路书引用日程和原始外链。
- 来源状态复用 FE-04 的中国标准时间时钟，不发送位置或成员数据。
- 首页只在存在需行动来源时显示提示；行中模式只统计当前日 `sourceIds`。
- 将“来源与复核”加入移动“更多”和全局页脚。
- 浏览器验收发现并修复 D0 生成无效观景深链的边界问题，详见 `fix/2026-08-25_chuanxi_roadbook_d0-scenic-link.md`。

## 修改文件

- `app/sources/page.tsx`
- `features/sources/source-model.ts`
- `features/sources/source-model.test.ts`
- `features/sources/source-catalog.tsx`
- `features/sources/source-review-alert.tsx`
- `features/trip/trip-home.tsx`
- `app/page.tsx`
- `components/layout/mobile-trip-navigation.tsx`
- `components/layout/site-footer.tsx`
- `package.json`
- `features/trip/on-trip-dashboard.tsx`
- `docs/开发设计文档/20260825_chuanxi_roadbook/fix/2026-08-25_chuanxi_roadbook_d0-scenic-link.md`

## 接口或数据结构变化

- 新增 `SourceReviewState`，包含来源、复核状态和可选的距复核天数。
- 季节 / 稳定来源默认提前 7 天进入复核窗口；实时来源在核实次日进入复核。
- 超过 `reviewAt` 一律标记 `expired`，但继续展示来源和旧结论。

## 验证结果

执行命令：

```text
corepack pnpm --version
corepack pnpm test
corepack pnpm exec tsc --noEmit
corepack pnpm lint
corepack pnpm exec prettier --write <FE-05 scoped files>
corepack pnpm build
git diff --check
```

结果：

- pnpm 版本为 `8.7.0`，`pnpm-lock.yaml` 仍为 v6 且本包未修改 lockfile。
- 单元测试 47/47 通过，覆盖稳定无复核日、季节七天窗口、实时次日复核、过期与行动项排序。
- TypeScript、全仓 ESLint、Prettier、production build 和 `git diff --check` 通过。
- `/sources` 为静态页，页面 JS 2.93 kB；首页 JS 为 7.46 kB；本包未新增依赖。
- 390 x 844、768 x 1024、1440 x 1000 与深色模式无横向溢出，控制台无错。
- 当前日期 2026-08-25 下 7 项来源均无到期动作，首页不显示不必要的警告。
- D0 移动观景入口已指向 D1，D0 行中首页不显示“当天观景顺序”。

## 未完成事项

- 真实来源尚无 `live` 类型，当前通过单元测试验证其规则。
- 9 月 20 日的季节来源复核属于 CONTENT-03，不能由页面自动判定新结论。

## 下一步建议

- 进入 NAV-01，完成地图深链、中文地点编码、复制退化和设备级验收。
- 严格沿用观景停车权限校验，P2 / 禁停 / 景交 / 步行节点不得生成停车导航。
