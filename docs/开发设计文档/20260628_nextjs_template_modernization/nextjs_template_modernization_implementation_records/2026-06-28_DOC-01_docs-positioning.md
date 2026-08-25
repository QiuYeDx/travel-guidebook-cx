# 工作包 DOC-01：README 与 AGENT 定位更新

## 基本信息

- 日期：2026-06-28
- 状态：已完成
- 对应执行计划工作包：DOC-01 README 与 AGENT 定位更新

## 本次实现内容

- 将 README 从“功能完整模板项目”说明改为“纯净 Next.js 启动脚手架”说明。
- 明确模板边界：默认不包含 Markdown、博客、图库、OSS、认证、数据库、评论、统计、CMS、复杂视觉特效等领域能力。
- 补充快速开始、脚本、目录结构、内置 UI、shadcn/ui 与 qiuye-ui 按需添加方式、主题系统、可选库推荐、部署配置片段。
- 将 AGENT 规则改写为模板仓库专用约束，强调纯净模板、组件目录边界、依赖克制、Server Component 默认优先和前端服务清理要求。

## 修改文件

- `README.md`
- `AGENT.md`
- `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_execution_plan.md`
- `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_implementation_records/2026-06-28_DOC-01_docs-positioning.md`

## 接口或数据结构变化

- 无代码接口变化。
- 无运行时数据结构变化。

## 验证结果

执行命令：

```text
pnpm lint
./node_modules/.bin/eslint
```

结果：

- `pnpm lint` 未进入 ESLint 阶段；当前 Codex runtime 使用 pnpm `11.7.0`，仓库 `pnpm-lock.yaml` 为 lockfile v6，pnpm 在非 TTY 下尝试处理 `node_modules` 时中止，报 `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`。
- `./node_modules/.bin/eslint` 执行成功，退出码 0。

## 未完成事项

- 未处理 pnpm 运行器与 lockfile 兼容问题；建议在后续 `DEPS-02` 或 `QA-01` 中统一处理。
- 本工作包只更新文档定位，未改代码结构、首页、组件或依赖。

## 下一步建议

- 按执行计划继续 `SHELL-01 配置层与 App Shell 轻量整理`。
