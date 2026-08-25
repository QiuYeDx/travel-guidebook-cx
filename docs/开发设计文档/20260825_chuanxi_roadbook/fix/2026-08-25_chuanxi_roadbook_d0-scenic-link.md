# D0 观景深链边界修复

## 背景与现象

FE-05 移动端验收时，当前日为 D0，底部“更多 → 沿途观景”会生成 `/scenic?day=D0`，行中首页同时显示“当天观景顺序”。实际观景目录只覆盖 D1-D9，D0 为成都集结日。

## 根因

全局导航和行中首页直接重用 `selectedDayId`，没有检查 `ScenicDayPlan` 是否存在。

## 修复后行为

- 当全局当前日为 D0 时，“沿途观景”打开首个有效观景日 D1。
- 当当天没有 `ScenicDayPlan` 时，行中首页不显示无效的“当天观景顺序”操作。
- D1-D9 仍使用自身当日观景深链。

## 影响文件

- `components/layout/mobile-trip-navigation.tsx`
- `features/trip/on-trip-dashboard.tsx`

## 验证

- `corepack pnpm test`
- `corepack pnpm exec tsc --noEmit`
- `corepack pnpm lint`
- `corepack pnpm build`
- 390 x 844 浏览器验收 D0 导航与行中首页。
