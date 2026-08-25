# 移除清单功能

## 背景

团队确认路书不需要行前、出发和收车清单，清单页面会增加移动端导航和信息密度。

## 预期行为

- 不生成 `/checklists` 路由。
- 移除清单数据、组件、localStorage 模型和测试。
- Service Worker 不再缓存清单页面和参数 URL。
- 单日页只保留“注意”Tab 中的必须完成、降级触发和住宿信息。

## 实现摘要

- 删除 `app/checklists/page.tsx`、`features/checklist/*` 和 `data/trips/2026-chuanxi/checklists.ts`。
- 从 `package.json` 测试脚本和 `lib/offline/cache-config.ts` 移除清单路径。
- 移除旧行中首页的“当天清单”操作。
- 同步最终设计和执行计划，历史实施记录保留为变更背景。

## 验证

```text
corepack pnpm exec tsc --noEmit
corepack pnpm lint
corepack pnpm test
corepack pnpm build
```

- 52/52 测试通过。
- 无 `/checklists` 路由生成。
- TypeScript、ESLint 和生产构建通过。
