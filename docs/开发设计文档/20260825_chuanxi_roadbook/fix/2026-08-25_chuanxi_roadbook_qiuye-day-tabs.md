# 日程切换统一使用 qiuye-ui

## 背景

观景页的 D1-D9 选择器仍是手写的 Link 按钮组，行中执行页还保留原生 `<select>`。两者都属于日程单选切换，却没有使用项目约定的 qiuye-ui 选择组件。

## 修改内容

- `/scenic` 的 D1-D9 切换改为 qiuye-ui `ResponsiveTabs`，使用受控值同步 URL，并保留 D1-D9 的横向滚动和边缘渐变遮罩。
- 行中执行页的 D0-D9 日期选择改为同一套 `ResponsiveTabs`，移除原生 `<select>` 及重复的前后箭头选择器。
- 遗留的行前 / 行中模式选择改为 qiuye-ui `SegmentedControl`。
- `ResponsiveTabs` 支持无内容面板模式和自定义 `ariaLabel`，可作为页面级导航切换器复用。

## 验收

- `/scenic?day=D1` 渲染 9 个 `role=tab` 日程选项。
- 点击 D2 后 URL 切换到 `day=D2`，页面标题和数据同步更新。
- 390px 视口下页面无横向溢出，日程 Tab 列表仅在自身区域滚动。
- `corepack pnpm exec tsc --noEmit`
- `corepack pnpm lint`
- `corepack pnpm test`
- `corepack pnpm build`
