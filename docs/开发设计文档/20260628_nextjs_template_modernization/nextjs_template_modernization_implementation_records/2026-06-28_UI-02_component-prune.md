# 工作包 UI-02：低频组件收缩

## 基本信息

- 日期：2026-06-28
- 状态：已完成
- 对应执行计划工作包：UI-02 低频组件收缩

## 本次实现内容

- 删除默认模板未引用、且 final design 明确判断为低频或场景型的 shadcn/ui 组件。
- 删除未挂载的 `components/app-sidebar.tsx`，移除后台/内容管理等非纯净模板语义。
- 保留 final design 中的高频通用基线组件，包括 `textarea`、`label`、`select`、`dropdown-menu`、`sheet`、`drawer`、`popover`、`tooltip`、`tabs`、`avatar`、`scroll-area`、`skeleton` 等。
- 更新 README 的项目结构和内置 UI 组件清单，使文档与实际文件一致。

## 修改文件

- `README.md`
- `components/app-sidebar.tsx`
- `components/ui/alert-dialog.tsx`
- `components/ui/aspect-ratio.tsx`
- `components/ui/breadcrumb.tsx`
- `components/ui/menubar.tsx`
- `components/ui/navigation-menu.tsx`
- `components/ui/pagination.tsx`
- `components/ui/progress.tsx`
- `components/ui/radio-group.tsx`
- `components/ui/resizable.tsx`
- `components/ui/sidebar.tsx`
- `components/ui/slider.tsx`
- `components/ui/table.tsx`
- `components/ui/toggle.tsx`
- `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_execution_plan.md`
- `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_implementation_records/2026-06-28_UI-02_component-prune.md`

## 接口或数据结构变化

- 无运行时接口变化。
- 模板默认预置的 `components/ui/` 文件集合收缩为：

```text
avatar
badge
button
card
dialog
drawer
dropdown-menu
input
label
popover
scroll-area
select
separator
sheet
skeleton
sonner
switch
tabs
textarea
tooltip
```

## 验证结果

执行命令：

```text
rg -n "@/components/ui/(alert-dialog|aspect-ratio|breadcrumb|menubar|navigation-menu|pagination|progress|radio-group|resizable|sidebar|slider|table|toggle)|@/components/app-sidebar|AppSidebar|app-sidebar" app components config hooks lib --glob '*.ts' --glob '*.tsx'
rg --files components/ui components/qiuye-ui | sort
./node_modules/.bin/eslint
./node_modules/.bin/next build --turbopack
```

结果：

- 已删除组件在源码引用扫描中无匹配。
- `components/ui/` 与 `components/qiuye-ui/` 文件集合与 README 清单一致。
- `./node_modules/.bin/eslint` 通过。
- `./node_modules/.bin/next build --turbopack` 提权后通过。

## 未完成事项

- 本包不删除依赖；`@radix-ui/*`、`react-resizable-panels` 等是否还能移除，留给 DEPS-01/DEPS-02 审计和 lockfile 更新。
- `pnpm lint` / `pnpm build` 仍有 pnpm 11 与 lockfile v6/非 TTY 兼容问题，本次继续使用本地二进制完成等价验证。

## 下一步建议

- 继续 DEPS-01，对 `package.json` 的依赖逐项做引用审计。
- DEPS-02 再统一移除因组件收缩变成未使用的依赖，并更新 `pnpm-lock.yaml`。
