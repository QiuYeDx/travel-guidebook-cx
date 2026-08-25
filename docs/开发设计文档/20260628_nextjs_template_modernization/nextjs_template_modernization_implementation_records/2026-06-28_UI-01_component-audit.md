# 工作包 UI-01：组件引用审计与基线确认

## 基本信息

- 日期：2026-06-28
- 状态：已完成
- 对应执行计划工作包：UI-01 组件引用审计与基线确认

## 本次实现内容

- 使用 `rg` 扫描 `app/`、`components/`、`config/`、`hooks/`、`lib/` 中对 `@/components/ui/*` 与 `@/components/qiuye-ui/*` 的引用。
- 统计 `components/ui/` 与 `components/qiuye-ui/` 每个组件的引用来源，区分默认运行路径、组件内部依赖、未挂载示例链条。
- 确认 `components/app-sidebar.tsx` 当前没有被 `app/` 或布局挂载，且包含 `仪表板`、`内容管理` 等非纯净模板语义，建议作为 UI-02 的优先删除候选。
- 本工作包只审计和记录，不删除组件。

## 修改文件

- `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_execution_plan.md`
- `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_implementation_records/2026-06-28_UI-01_component-audit.md`

## 接口或数据结构变化

- 无。

## 引用审计结果

默认模板运行路径直接引用：

| 组件 | 引用来源 | 结论 |
|---|---|---|
| `components/ui/badge.tsx` | `app/page.tsx`, `app/about/page.tsx` | 保留 |
| `components/ui/button.tsx` | `app/page.tsx`, `app/about/page.tsx`, `components/qiuye-ui/dual-state-toggle.tsx` | 保留 |
| `components/ui/card.tsx` | `app/page.tsx`, `app/about/page.tsx` | 保留 |
| `components/ui/dialog.tsx` | `app/page.tsx` | 保留 |
| `components/ui/input.tsx` | `app/page.tsx` | 保留 |
| `components/ui/separator.tsx` | `app/page.tsx`, `app/about/page.tsx` | 保留 |
| `components/ui/sonner.tsx` | `components/providers/app-providers.tsx` | 保留 |
| `components/qiuye-ui/dual-state-toggle.tsx` | `components/theme-toggle.tsx` | 保留 |

组件内部或未挂载链条引用：

| 组件 | 引用来源 | 结论 |
|---|---|---|
| `components/ui/sidebar.tsx` | `components/app-sidebar.tsx` | UI-02 优先候选删除 |
| `components/app-sidebar.tsx` | 无外部引用 | UI-02 优先候选删除 |
| `components/ui/sheet.tsx` | `components/ui/sidebar.tsx` | 随 sidebar 链条一起评估 |
| `components/ui/skeleton.tsx` | `components/ui/sidebar.tsx` | 随 sidebar 链条一起评估 |
| `components/ui/tooltip.tsx` | `components/ui/sidebar.tsx` | 随 sidebar 链条一起评估 |
| `components/ui/alert-dialog.tsx` | 仅内部引用 `buttonVariants`，无外部引用 | 候选删除 |
| `components/ui/pagination.tsx` | 仅内部引用 `Button` / `buttonVariants`，无外部引用 | 候选删除 |

无直接引用组件：

```text
alert-dialog
aspect-ratio
avatar
breadcrumb
drawer
dropdown-menu
label
menubar
navigation-menu
pagination
popover
progress
radio-group
resizable
scroll-area
select
slider
switch
table
tabs
textarea
toggle
```

其中 `avatar`、`dropdown-menu`、`label`、`popover`、`select`、`switch`、`tabs`、`textarea` 等属于常见基础 UI，UI-02 应结合 README 的“内置组件清单”目标再决定保留或删除；`breadcrumb`、`menubar`、`navigation-menu`、`pagination`、`progress`、`radio-group`、`resizable`、`sidebar`、`table` 等更偏场景型，适合作为更强删除候选。

## 验证结果

执行命令：

```text
rg -n "@/components/(ui|qiuye-ui)/" app components config hooks lib --glob '*.ts' --glob '*.tsx'
rg -n "AppSidebar|app-sidebar|Sidebar" app components config hooks lib --glob '*.ts' --glob '*.tsx'
rg -n "Markdown|markdown|博客|内容|图库|仪表板|AI|摄影|OSS|评论|统计|dashboard|content|gallery|analytics" app components config README.md AGENT.md --glob '*.tsx' --glob '*.ts' --glob '*.md'
node - <<'NODE' ... NODE
./node_modules/.bin/eslint
```

结果：

- `rg` 确认默认页面和 Shell 只直接使用 `badge`、`button`、`card`、`dialog`、`input`、`separator`、`sonner`、`dual-state-toggle`。
- `rg` 确认 `components/app-sidebar.tsx` 未被默认运行路径引用，但包含后台/内容管理语义，应在 UI-02 删除。
- `./node_modules/.bin/eslint` 通过。

## 未完成事项

- 尚未删除任何组件。
- 尚未同步 README 的最终内置组件清单，需等 UI-02 实际收缩后再更新。

## 下一步建议

- 继续 UI-02，优先删除 `components/app-sidebar.tsx` 与 `components/ui/sidebar.tsx` 以及仅由 sidebar 链条带出的低频组件。
- 删除前再次运行引用检查，删除后运行 `./node_modules/.bin/eslint` 和 `./node_modules/.bin/next build --turbopack`。
