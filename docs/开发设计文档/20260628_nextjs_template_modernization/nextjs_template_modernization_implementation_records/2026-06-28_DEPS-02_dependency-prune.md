# 工作包 DEPS-02：依赖瘦身与 lockfile 更新

## 基本信息

- 日期：2026-06-28
- 状态：已完成
- 对应执行计划工作包：DEPS-02 依赖瘦身与 lockfile 更新

## 本次实现内容

- 按 DEPS-01 审计清单移除默认模板未引用的 direct dependencies。
- 更新 `pnpm-lock.yaml`，最终保持 pnpm 8 兼容的 `lockfileVersion: '6.0'`。
- 在 `package.json` 中新增 `packageManager: "pnpm@8.7.0"`，避免后续 Agent 或 Corepack 使用更高版本 pnpm 自动升级 lockfile 格式。
- 同步 README 的 pnpm 要求为 `pnpm 8.7.0 recommended`。
- 保留 `prettier`，因为 README 将 ESLint 与 Prettier 作为模板工具链能力声明。

## 修改文件

- `package.json`
- `pnpm-lock.yaml`
- `README.md`
- `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_execution_plan.md`
- `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_implementation_records/2026-06-28_DEPS-02_dependency-prune.md`

## 接口或数据结构变化

- 无运行时接口变化。
- `pnpm-lock.yaml` 保持 v6 格式，新 clone 项目建议使用 pnpm 8.7.0。
- `package.json` 新增 `packageManager` 字段用于锁定包管理器版本。

## 移除依赖

从 `dependencies` 移除：

```text
@heroicons/react
@radix-ui/react-alert-dialog
@radix-ui/react-aspect-ratio
@radix-ui/react-menubar
@radix-ui/react-navigation-menu
@radix-ui/react-progress
@radix-ui/react-radio-group
@radix-ui/react-slider
@radix-ui/react-toggle
@react-spring/web
@reactuses/core
ahooks
dayjs
i18next
lodash
react-i18next
react-resizable-panels
use-clipboard-copy
zustand
```

从 `devDependencies` 移除：

```text
@types/lodash
```

保留依赖与当前模板源码对应：

- Next.js / React / TypeScript / Tailwind / ESLint 基础工具链。
- 主题与交互：`next-themes`、`motion`、`sonner`、`vaul`。
- 图标与样式工具：`lucide-react`、`class-variance-authority`、`clsx`、`tailwind-merge`。
- 当前保留 shadcn/ui 组件实际需要的 Radix 包。

## 验证结果

执行命令：

```text
pnpm install --lockfile-only --ignore-scripts
CI=true npx --yes pnpm@8.7.0 install --lockfile-only --ignore-scripts
CI=true npx --yes pnpm@8.7.0 install --ignore-scripts
npx --yes pnpm@8.7.0 --version
npx --yes pnpm@8.7.0 lint
npx --yes pnpm@8.7.0 build
rg -n "(@heroicons/react|@react-spring/web|@reactuses/core|ahooks:|dayjs:|i18next:|react-i18next|react-resizable-panels|use-clipboard-copy|zustand:|@types/lodash|@radix-ui/react-alert-dialog|@radix-ui/react-aspect-ratio|@radix-ui/react-menubar|@radix-ui/react-navigation-menu|@radix-ui/react-progress|@radix-ui/react-radio-group|@radix-ui/react-slider|@radix-ui/react-toggle)" package.json pnpm-lock.yaml
```

结果：

- 当前 Codex runtime 的 pnpm 11.7.0 会把旧 v6 lockfile 升级为 v9；已按用户常用版本用 `pnpm@8.7.0` 重新生成 v6 lockfile。
- `CI=true npx --yes pnpm@8.7.0 install --lockfile-only --ignore-scripts` 成功。
- 仅生成 lockfile 后直接运行 lint 会因 `node_modules` 尚未同步而报 `eslint: command not found`；随后执行 `CI=true npx --yes pnpm@8.7.0 install --ignore-scripts` 成功同步依赖。
- `npx --yes pnpm@8.7.0 --version` 输出 `8.7.0`。
- `npx --yes pnpm@8.7.0 lint` 通过。
- `npx --yes pnpm@8.7.0 build` 通过。
- 候选删除依赖不再作为 direct dependency 出现在 `package.json` / `pnpm-lock.yaml`。

## 未完成事项

- pnpm 解析阶段提示 `next@15.5.7` 有安全更新风险；本包只做依赖瘦身，没有做 Next 版本升级。建议 QA 或后续独立 fix 包评估升级到补丁版本。

## 下一步建议

- 继续 QA-01，做最终文档同步、全量验证和工作树整理。
- QA-01 如决定处理 Next 安全提示，应先确认目标版本兼容 React 19 与当前 Next App Router 代码，再更新 `next` / `eslint-config-next` / lockfile。
