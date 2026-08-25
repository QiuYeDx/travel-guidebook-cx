# 深色主题按钮首帧 Hydration 修复

## 背景与现象

FE-03 浏览器验收中，先切换深色主题再跳转到新页面时，控制台报告主题按钮 hydration mismatch。
服务端首帧为太阳图标，客户端从持久化主题读到深色后在 hydration 首帧直接渲染月亮图标。

## 根因

`components/theme-toggle.tsx` 直接用 `resolvedTheme` 决定 `DualStateToggle` 分支，没有等待客户端挂载。

## 预期行为

- 服务端与客户端 hydration 首帧使用相同分支和稳定 36 px 按钮尺寸。
- 挂载后再根据 `resolvedTheme` 更新图标与标签。
- 挂载前按钮不可交互，避免在主题未解析时误切换。

## 影响文件

- `components/theme-toggle.tsx`

## 实现摘要

新增 `mounted` 状态；首帧固定以非激活分支渲染并禁用按钮，`useEffect` 挂载后再启用实际主题状态。

## 验证

- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm build`
- 在深色偏好下新建浏览器页签直接打开 `/safety`，页面保持深色，控制台无 hydration 或其他错误。

## 后续建议

未来其他依赖 `next-themes` 的首帧分支组件应复用相同的挂载边界。
