# 工作包 HOME-01：首页纯净化

## 基本信息

- 日期：2026-06-28
- 状态：已完成
- 对应执行计划工作包：HOME-01 首页纯净化

## 本次实现内容

- 将 `app/page.tsx` 从较重的营销式模板展示页改为轻量 starter 首页。
- 移除首页中的 Motion 入场动画、项目树大段展示、功能丰富/工具丰富等容易误导为“大而全 starter kit”的表达。
- 保留模板必要信息：项目名、描述、GitHub/About 链接、clone/install/dev 命令、基础栈标签。
- 增加小型 UI smoke test，验证 Button、Dialog、Input、Toast 等基础组件连通。
- 明确展示“不默认包含”的能力：Markdown、CMS、Auth、Database、Uploads、Analytics、Comments、3D scenes。

## 修改文件

- `app/page.tsx`
- `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_execution_plan.md`
- `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_implementation_records/2026-06-28_HOME-01_clean-home.md`

## 接口或数据结构变化

- 无接口变化。
- 首页继续作为 Client Component，因为复制命令、Toast 和 Dialog 示例需要浏览器交互。

## 验证结果

执行命令：

```text
./node_modules/.bin/eslint
./node_modules/.bin/next build --turbopack
```

结果：

- `./node_modules/.bin/eslint` 执行成功，退出码 0。
- 首次 `./node_modules/.bin/next build --turbopack` 在沙箱内因 Turbopack/PostCSS 创建子进程并绑定本地端口被拦截，报 `Operation not permitted`。
- 使用提权重跑 `./node_modules/.bin/next build --turbopack` 成功，完成生产构建、类型检查和静态页面生成。

## 未完成事项

- `pnpm lint` / `pnpm build` 仍受当前 Codex runtime pnpm 11 与仓库 lockfile v6/非 TTY 兼容问题影响，后续 `DEPS-02` 或 `QA-01` 需要统一处理。
- About 页面尚未纯净化，仍属于后续 `ABOUT-01` 范围。

## 下一步建议

- 继续 `ABOUT-01 About 示例页纯净化`。
