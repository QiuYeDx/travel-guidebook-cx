# qiuvision 视觉语言与 ResponsiveTabs 恢复

## 背景

项目中的 `ResponsiveTabs` 曾被简化为滚动容器包裹 `TabsList`，导致固定背景层和选中态在滚动与渐变遮罩中出现裁切，业务页面的 Tab 看起来像直角。观景页和部分执行卡片也使用了过小的圆角，整体视觉与 qiuvision 的圆润卡片语言不一致。

## 修改内容

- 恢复 qiuvision 的完整 `ResponsiveTabs`：固定圆角背景层、独立横向滚动轨道、自动定位激活项、悬停滚动按钮、边缘渐变遮罩和 `motion` 选中态平移动画。
- 仅保留 `ariaLabel` 作为无障碍增强，不改变组件原生视觉参数和默认布局。
- 观景摘要、观景详情、路线节点、安全信息和执行摘要等业务卡片统一提升为 `rounded-xl` / `rounded-2xl`，避免直角卡片观感。

## 验证

- 生产构建 `/scenic?day=D1`：两个 Tab 组均保持圆角背景层，`TabsList` 计算圆角为 14px，激活触发器圆角为 10px。
- 390px 和桌面视口无横向溢出，Tab 内容只在内部滚动。
- 生产页控制台无错误。
- `corepack pnpm exec tsc --noEmit`
- `corepack pnpm lint`
- `corepack pnpm test`
- `corepack pnpm build`
