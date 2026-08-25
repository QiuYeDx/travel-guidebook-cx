# 总览 Hero 明暗主题适配修复

## 背景

首页总览的 Hero 使用了深绿色渐变、白色文字和半透明白色边框，颜色值直接写在组件 className 中。浅色主题下背景偏暗，深色主题下对比关系也不稳定，导致日期、标题、说明、按钮和指标区域无法随主题切换保持一致的阅读层级。

## 修改内容

- 使用 Tailwind 主题语义 token 重建 Hero：浅色使用 `from-emerald-50`，深色使用 `dark:from-emerald-950/45`，其余区域跟随 `background`。
- 标题使用 `text-foreground`，说明和指标标签使用 `text-muted-foreground`，指标值使用 `text-foreground`。
- 日期标记改用 `Badge` 的 `secondary` 变体。
- 主行动使用默认 `Button` 变体，次行动使用 `outline` 变体并叠加 `bg-background/70`，避免按钮文字和边框依赖白色。
- 指标分隔线改用 `border-border`，确保浅色和深色主题均有稳定的边界对比度。
- 总览底部路线节奏卡片增加 `min-w-0` 与内部裁切约束，避免横向路线条的内容撑开移动端页面。

## 约束

- 不改变路线数据、页面信息架构或导航行为。
- 不引入新的硬编码 RGBA / 白色文字层，保持现有 qiuye-ui 组件和主题变量体系。
- 保留移动端和桌面端的网格布局，仅调整颜色语义。

## 验证

- `corepack pnpm exec tsc --noEmit`
- `corepack pnpm lint`
- `corepack pnpm test`
- `corepack pnpm build`
- 浏览器检查首页 390 px / 1440 px 的浅色和深色主题，确认 Hero 背景、标题、说明、按钮、指标文字及分隔线均跟随主题变化，无白色写死颜色和横向溢出。
