# 工作包 DEPS-01：依赖引用审计

## 基本信息

- 日期：2026-06-28
- 状态：已完成
- 对应执行计划工作包：DEPS-01 依赖引用审计

## 本次实现内容

- 对 `package.json` 的 `dependencies` 和 `devDependencies` 做逐项引用扫描。
- 区分核心框架/工具链依赖、当前默认代码直接引用依赖、保留 UI 组件实际需要的 Radix 依赖、DEPS-02 候选删除依赖。
- 本工作包只审计和记录，没有修改 `package.json` 或 `pnpm-lock.yaml`。

## 修改文件

- `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_execution_plan.md`
- `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_implementation_records/2026-06-28_DEPS-01_dependency-audit.md`

## 接口或数据结构变化

- 无。

## 审计结论

### 核心保留依赖

| 依赖 | 引用或用途 | 结论 |
|---|---|---|
| `next` | `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/about/page.tsx`, scripts | 保留 |
| `react` | 页面、Provider、UI 组件、hooks | 保留 |
| `react-dom` | `components/theme-toggle.tsx` 使用 `flushSync` | 保留 |
| `typescript` | TypeScript 项目基础能力 | 保留 |
| `tailwindcss` | `app/globals.css` | 保留 |
| `@tailwindcss/postcss` | `postcss.config.mjs` | 保留 |
| `tw-animate-css` | `app/globals.css` | 保留 |
| `eslint` | `package.json` lint script 与 ESLint 配置 | 保留 |
| `eslint-config-next` | `eslint.config.mjs` 通过 `next/core-web-vitals` / `next/typescript` 使用 | 保留 |
| `@eslint/eslintrc` | `eslint.config.mjs` | 保留 |
| `@types/node` | TS/Next 工具链类型 | 保留 |
| `@types/react` | React 类型 | 保留 |
| `@types/react-dom` | React DOM 类型 | 保留 |
| `prettier` | 模板工具链依赖，README 已声明 | 暂缓保留 |

### 默认代码直接引用保留

| 依赖 | 引用来源 | 结论 |
|---|---|---|
| `lucide-react` | 首页、About、Header/Footer、主题切换、部分 UI 组件 | 保留 |
| `next-themes` | `components/theme-provider.tsx`, `components/theme-toggle.tsx`, `components/ui/sonner.tsx` | 保留 |
| `motion` | `components/qiuye-ui/dual-state-toggle.tsx` | 保留 |
| `sonner` | `app/page.tsx`, `components/ui/sonner.tsx` | 保留 |
| `vaul` | `components/ui/drawer.tsx` | 保留 |
| `class-variance-authority` | `components/ui/button.tsx`, `components/ui/badge.tsx` | 保留 |
| `clsx` | `lib/utils.ts` | 保留 |
| `tailwind-merge` | `lib/utils.ts` | 保留 |

### 保留 UI 组件需要的 Radix 依赖

| 依赖 | 引用来源 | 结论 |
|---|---|---|
| `@radix-ui/react-avatar` | `components/ui/avatar.tsx` | 保留 |
| `@radix-ui/react-dialog` | `components/ui/dialog.tsx`, `components/ui/sheet.tsx` | 保留 |
| `@radix-ui/react-dropdown-menu` | `components/ui/dropdown-menu.tsx` | 保留 |
| `@radix-ui/react-label` | `components/ui/label.tsx` | 保留 |
| `@radix-ui/react-popover` | `components/ui/popover.tsx` | 保留 |
| `@radix-ui/react-scroll-area` | `components/ui/scroll-area.tsx` | 保留 |
| `@radix-ui/react-select` | `components/ui/select.tsx` | 保留 |
| `@radix-ui/react-separator` | `components/ui/separator.tsx` | 保留 |
| `@radix-ui/react-slot` | `components/ui/button.tsx`, `components/ui/badge.tsx` | 保留 |
| `@radix-ui/react-switch` | `components/ui/switch.tsx` | 保留 |
| `@radix-ui/react-tabs` | `components/ui/tabs.tsx` | 保留 |
| `@radix-ui/react-tooltip` | `components/ui/tooltip.tsx` | 保留 |

### DEPS-02 候选删除依赖

这些依赖在源码与配置扫描中没有命中，或对应组件已在 UI-02 删除：

| 依赖 | 原因 | 建议 |
|---|---|---|
| `@heroicons/react` | 默认代码使用 `lucide-react`，无引用 | 删除 |
| `@react-spring/web` | 无引用 | 删除 |
| `@reactuses/core` | 无引用 | 删除 |
| `ahooks` | 无引用 | 删除 |
| `dayjs` | 仅 README 可选推荐提及，源码无引用 | 删除 |
| `i18next` | 仅 README 可选推荐提及，源码无引用 | 删除 |
| `react-i18next` | 无引用 | 删除 |
| `lodash` | 仅 README 可选推荐提及，源码无引用 | 删除 |
| `@types/lodash` | `lodash` 无引用 | 删除 |
| `use-clipboard-copy` | 无引用 | 删除 |
| `zustand` | 仅 README 可选推荐提及，源码无引用 | 删除 |
| `@radix-ui/react-alert-dialog` | `components/ui/alert-dialog.tsx` 已删除 | 删除 |
| `@radix-ui/react-aspect-ratio` | `components/ui/aspect-ratio.tsx` 已删除 | 删除 |
| `@radix-ui/react-menubar` | `components/ui/menubar.tsx` 已删除 | 删除 |
| `@radix-ui/react-navigation-menu` | `components/ui/navigation-menu.tsx` 已删除 | 删除 |
| `@radix-ui/react-progress` | `components/ui/progress.tsx` 已删除 | 删除 |
| `@radix-ui/react-radio-group` | `components/ui/radio-group.tsx` 已删除 | 删除 |
| `@radix-ui/react-slider` | `components/ui/slider.tsx` 已删除 | 删除 |
| `@radix-ui/react-toggle` | `components/ui/toggle.tsx` 已删除 | 删除 |
| `react-resizable-panels` | `components/ui/resizable.tsx` 已删除 | 删除 |

## 验证结果

执行命令：

```text
rg -n "(from|import) ['\"]|require\\(" app components config hooks lib next.config.ts postcss.config.mjs eslint.config.mjs tsconfig.json components.json app/globals.css --glob '!node_modules' --glob '!.next'
rg -n "(@heroicons/react|@react-spring/web|@reactuses/core|ahooks|dayjs|i18next|react-i18next|lodash|use-clipboard-copy|zustand|react-resizable-panels|@radix-ui/react-alert-dialog|@radix-ui/react-aspect-ratio|@radix-ui/react-menubar|@radix-ui/react-navigation-menu|@radix-ui/react-progress|@radix-ui/react-radio-group|@radix-ui/react-slider|@radix-ui/react-toggle)" app components config hooks lib next.config.ts postcss.config.mjs eslint.config.mjs tsconfig.json components.json package.json README.md AGENT.md --glob '!node_modules' --glob '!.next'
node - <<'NODE' ... NODE
./node_modules/.bin/eslint
```

结果：

- 依赖逐项扫描完成，DEPS-02 候选删除清单已形成。
- `package.json` 与 `pnpm-lock.yaml` 未修改。
- `./node_modules/.bin/eslint` 通过。

## 未完成事项

- 尚未删除依赖，尚未更新 lockfile。
- `prettier` 当前没有独立 script/config，但作为 README 声明的模板工具链依赖暂缓保留；DEPS-02 可选择补 `format` 脚本或移除 README 提及与依赖。

## 下一步建议

- 继续 DEPS-02，按候选清单修改 `package.json` 并更新 `pnpm-lock.yaml`。
- DEPS-02 完成后运行 `pnpm install`、`./node_modules/.bin/eslint`、`./node_modules/.bin/next build --turbopack`，并同步 README 的实际依赖描述。
