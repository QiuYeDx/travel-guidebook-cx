# Next.js 纯净启动模板现代化执行计划

## 使用方式

每个后续开发会话开始前必须先阅读：

- `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_final_design.md`
- 本执行计划 `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_execution_plan.md`

然后按以下顺序工作：

1. 查看“进度台账”，选择一个状态为 `未开始` 或 `进行中` 的最小工作包。
2. 在动代码前检查相关文件当前内容和 `git status --short`。
3. 只修改当前工作包范围内的文件。
4. 完成后运行对应验证命令。
5. 更新本执行计划台账。
6. 在 `nextjs_template_modernization_implementation_records/` 下新增本次实现记录。
7. 如果验证或实际实现改变了设计约束，同步更新 final design。

本计划不是第二份设计文档。设计判断以 final design 为准，本文件只负责拆分工作、记录状态和交接。

## 状态规则

只使用以下状态：

- `未开始`：尚未动手。
- `进行中`：已有部分修改，但未完成或未验证。
- `已完成`：代码和文档已完成，并通过对应验证。
- `阻塞`：因缺少信息、依赖安装失败、验证环境不可用等原因无法继续。
- `废弃`：工作包不再需要，必须在 open issues 中说明原因。

状态更新原则：

- 不因“代码已写完”就标 `已完成`，必须记录验证结果。
- 多个包一起完成时，台账仍逐项更新。
- 若某包范围扩大，优先新增后续包，不在原包里无边界扩张。
- 如启动 `pnpm dev` 或其他前端服务，结束前必须关闭本轮启动的服务进程。

## 进度台账

| 工作包 | 状态 | 完成日期 | 关键变更文件 | 验证 | 实施记录 | Open issues |
|---|---|---:|---|---|---|---|
| DOC-00 最终设计定稿 | 已完成 | 2026-06-28 | `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_final_design.md` | 人工检查文档方向：纯净模板、排除 Markdown/图库/OSS 等领域能力 | 无，设计阶段记录在文档本身 | 无 |
| DOC-01 README 与 AGENT 定位更新 | 已完成 | 2026-06-28 | `README.md`, `AGENT.md` | `pnpm lint` 因 pnpm 11 与 lockfile v6/非 TTY 兼容问题未进入 ESLint；改用 `./node_modules/.bin/eslint` 通过 | `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_implementation_records/2026-06-28_DOC-01_docs-positioning.md` | 后续 QA 或 DEPS 包需处理 pnpm 运行器/lockfile 兼容问题 |
| SHELL-01 配置层与 App Shell 轻量整理 | 已完成 | 2026-06-28 | `config/site.ts`, `app/layout.tsx`, `components/providers/app-providers.tsx`, `components/layout/site-header.tsx`, `components/layout/site-footer.tsx`, `components/header.tsx`, `components/footer.tsx` | `./node_modules/.bin/eslint` 通过；`./node_modules/.bin/next build --turbopack` 提权后通过 | `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_implementation_records/2026-06-28_SHELL-01_app-shell.md` | 旧 `components/header.tsx` / `footer.tsx` 保留为兼容 re-export，后续 UI 收缩包再决定是否删除 |
| HOME-01 首页纯净化 | 已完成 | 2026-06-28 | `app/page.tsx` | `./node_modules/.bin/eslint` 通过；`./node_modules/.bin/next build --turbopack` 提权后通过 | `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_implementation_records/2026-06-28_HOME-01_clean-home.md` | `pnpm lint`/`pnpm build` 仍受 pnpm 11 与 lockfile v6/非 TTY 问题影响，验证暂用本地二进制 |
| ABOUT-01 About 示例页纯净化 | 已完成 | 2026-06-28 | `app/about/page.tsx` | `./node_modules/.bin/eslint` 通过；`./node_modules/.bin/next build --turbopack` 提权后通过 | `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_implementation_records/2026-06-28_ABOUT-01_clean-about.md` | `pnpm lint`/`pnpm build` 仍受 pnpm 11 与 lockfile v6/非 TTY 问题影响，验证暂用本地二进制 |
| UI-01 组件引用审计与基线确认 | 已完成 | 2026-06-28 | `components/ui/*`, `components/qiuye-ui/*`, `components/app-sidebar.tsx`, `app/*`, `components/*` | `rg` 引用检查完成；`./node_modules/.bin/eslint` 通过 | `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_implementation_records/2026-06-28_UI-01_component-audit.md` | UI-02 建议优先处理未挂载的 `components/app-sidebar.tsx` / `components/ui/sidebar.tsx` 链条，再收缩无引用组件 |
| UI-02 低频组件收缩 | 已完成 | 2026-06-28 | `components/app-sidebar.tsx`, 低频 `components/ui/*`, `README.md` | 已删组件源码引用 `rg` 无匹配；`./node_modules/.bin/eslint` 通过；`./node_modules/.bin/next build --turbopack` 提权后通过 | `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_implementation_records/2026-06-28_UI-02_component-prune.md` | 相关未使用依赖暂未删除，留给 DEPS-01/DEPS-02；`pnpm lint`/`pnpm build` 仍受 pnpm 运行器兼容问题影响，验证暂用本地二进制 |
| DEPS-01 依赖引用审计 | 已完成 | 2026-06-28 | `package.json` 审计记录, execution plan | 依赖逐项引用扫描完成；`./node_modules/.bin/eslint` 通过 | `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_implementation_records/2026-06-28_DEPS-01_dependency-audit.md` | 未修改 `package.json` / `pnpm-lock.yaml`；DEPS-02 候选删除清单已记录 |
| DEPS-02 依赖瘦身与 lockfile 更新 | 已完成 | 2026-06-28 | `package.json`, `pnpm-lock.yaml`, `README.md` | `CI=true npx --yes pnpm@8.7.0 install --lockfile-only --ignore-scripts` 成功；`CI=true npx --yes pnpm@8.7.0 install --ignore-scripts` 成功；`npx --yes pnpm@8.7.0 lint` 通过；`npx --yes pnpm@8.7.0 build` 通过 | `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_implementation_records/2026-06-28_DEPS-02_dependency-prune.md` | lockfile 保持 pnpm 8 兼容的 v6，`packageManager` 固定为 `pnpm@8.7.0`；pnpm 解析时提示 `next@15.5.7` 有安全更新风险，建议 QA/后续包评估补丁升级 |
| QA-01 全量验证与文档同步 | 已完成 | 2026-06-28 | `README.md`, `AGENT.md`, final design, execution plan | `CI=true npx --yes pnpm@8.7.0 install --frozen-lockfile --ignore-scripts` 成功；`npx --yes pnpm@8.7.0 lint` 通过；`npx --yes pnpm@8.7.0 build` 通过；`git diff --check` 通过 | `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_implementation_records/2026-06-28_QA-01_final-validation.md` | 未启动 `pnpm dev`；`next@15.5.7` 安全更新提示未在本包处理，建议单独 fix 包评估 |

## 工作包详情

### DOC-01 README 与 AGENT 定位更新

目标：

- 把 README 改成“纯净 Next.js 启动模板”说明。
- 把 AGENT 规则改成模板仓库规则，避免后续 Agent 默认加入业务系统。

范围：

- `README.md`
- `AGENT.md`

验收：

- README 明确说明模板定位、技术栈、目录结构、内置组件、如何添加 shadcn/ui 和 qiuye-ui 组件。
- README 提供常用可选库推荐，但不说这些库已经默认安装，除非实际保留。
- AGENT 明确禁止默认添加 Markdown、内容系统、图库、认证、数据库、评论、统计等领域能力。
- AGENT 保留“前端服务结束前必须关闭”的约束。

### SHELL-01 配置层与 App Shell 轻量整理

目标：

- 新增轻量 `config/site.ts`。
- 让 `app/layout.tsx` 只负责字体、metadata、全局 CSS 和 App Shell 组装。
- 把 Header/Footer/Provider 放到清晰目录。

范围：

- `config/site.ts`
- `app/layout.tsx`
- `components/providers/app-providers.tsx`
- `components/layout/site-header.tsx`
- `components/layout/site-footer.tsx`
- 旧 `components/header.tsx`、`components/footer.tsx` 的迁移或兼容处理。

验收：

- `siteConfig` 不包含业务栏目或领域配置。
- `app/layout.tsx` 不直接堆业务 Provider。
- `Toaster` 如保留，应通过 AppProviders 挂载。
- Header/Footer 从 `siteConfig` 读取项目名、导航和链接。

### HOME-01 首页纯净化

目标：

- 将首页从较重展示页改为可轻松删除或替换的 starter 示例页。
- 保留基础 UI 与主题能力验证。

范围：

- `app/page.tsx`
- 可选新增 `components/qiuye-ui/copy-button.tsx`

验收：

- 首页不出现博客、内容、AI、摄影、品牌官网等领域暗示。
- 首页展示项目名、描述、快速开始命令、技术栈、少量基础组件示例。
- 示例覆盖 Button、Input、Dialog 或 Sheet、Toast、ThemeToggle 中的主要能力。
- 不引入大型视觉背景或复杂页面结构。

### ABOUT-01 About 示例页纯净化

目标：

- 保留一个多页面路由示例。
- 避免个人品牌、业务故事和领域文案。

范围：

- `app/about/page.tsx`

验收：

- About 说明这是模板项目。
- 可展示 Card/Badge/Separator 等基础 UI。
- 页面可以被新项目快速删除，不与其他模块深耦合。

### UI-01 组件引用审计与基线确认

目标：

- 明确当前哪些 shadcn/ui 和 qiuye-ui 组件被默认代码引用。
- 输出保留、候选删除、暂缓处理清单。

范围：

- `components/ui/*`
- `components/qiuye-ui/*`
- 所有 app/components 引用。

验收：

- 实施记录中列出每个候选删除组件的引用结果。
- 不在本包中做大规模删除。
- 为 UI-02 提供明确输入。

### UI-02 低频组件收缩

目标：

- 删除未被默认模板引用、且 final design 判断为低频或场景型的组件。
- 保持 shadcn CLI 可按需重新添加的能力。

范围：

- 未引用低频 `components/ui/*`
- 可能删除 `components/app-sidebar.tsx`。

验收：

- 删除后 `pnpm lint` 和 `pnpm build` 通过。
- README 的内置组件清单与实际文件一致。
- 不删除首页、About、Shell 所需组件。

### DEPS-01 依赖引用审计

目标：

- 对 `package.json` 中 dependencies/devDependencies 做引用审计。
- 区分核心保留、默认代码引用保留、未引用候选移除、可选推荐。

范围：

- `package.json`
- 全仓引用搜索。

验收：

- 实施记录列出每个候选依赖的引用情况。
- 不修改 `pnpm-lock.yaml`。
- 为 DEPS-02 提供删除清单。

### DEPS-02 依赖瘦身与 lockfile 更新

目标：

- 移除默认代码未使用的依赖。
- 更新 lockfile。

范围：

- `package.json`
- `pnpm-lock.yaml`
- 可能因依赖删除而需要调整 imports。

验收：

- `pnpm install` 成功。
- `pnpm lint` 成功。
- `pnpm build` 成功。
- README 的可选推荐库与实际依赖表述一致。

### QA-01 全量验证与文档同步

目标：

- 确认模板最终状态符合 final design。
- 补齐 execution plan 台账和实施记录。

范围：

- 文档与必要的小修。

验收：

- `pnpm lint` 成功。
- `pnpm build` 成功。
- 如运行 `pnpm dev`，进行基本页面检查后关闭服务。
- `git status --short` 中只包含本功能相关文件。
- final design、execution plan、README、AGENT 与实际代码不矛盾。

## 依赖顺序与优先级

推荐顺序：

1. `DOC-01`
2. `SHELL-01`
3. `HOME-01`
4. `ABOUT-01`
5. `UI-01`
6. `UI-02`
7. `DEPS-01`
8. `DEPS-02`
9. `QA-01`

优先级原则：

- 先固定项目定位和目录边界，再改代码。
- 先让 App Shell 和首页形成最小可运行闭环，再删除组件和依赖。
- 先审计，再删除。
- 依赖瘦身必须放在组件收缩之后，避免误删仍会被保留组件使用的 Radix 包。
- 每一步都保持项目可运行，避免大面积未完成重构。

## 不可违反约束

- 不新增 Markdown、MDX、内容系统、博客、图库、OSS、评论、统计、认证、数据库、CMS 等领域能力。
- 不复制 `/Users/qiuyedx/Documents/Github/qiuyedx-blog` 的业务文件。
- 不把自研组件放入 `components/ui/`。
- 不把强视觉风格组件、品牌动效、个人站文案放入模板默认页面。
- 不保留默认代码未使用的大型依赖，除非 README 明确解释其模板级必要性。
- 不在 `next.config.ts` 默认配置远程图片通配域名、静态导出、serverExternalPackages 或个人局域网 IP。
- 不在 Client Component 中引入服务端专用能力。
- 启动前端服务后，结束前必须关闭本轮启动的服务进程。

## 实施记录模板

后续每个工作包完成时，在以下目录新增实施记录：

```text
docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_implementation_records/
```

模板：

````markdown
# 工作包 <ID>：<标题>

## 基本信息

- 日期：
- 状态：已完成 / 部分完成 / 阻塞
- 对应执行计划工作包：

## 本次实现内容

-

## 修改文件

-

## 接口或数据结构变化

-

## 验证结果

执行命令：

```text

```

结果：

-

## 未完成事项

-

## 下一步建议

-
````

## 当前下一步建议

当前执行计划中的工作包已全部完成。本轮纯净模板现代化工作可进入提交或最终验收。

如需处理 `next@15.5.7` 的安全更新提示，应新增独立 fix 工作包评估 Next 补丁版本兼容性。
