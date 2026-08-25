# Next.js 纯净启动模板现代化最终设计

## 评审结论

上一版设计把 `/Users/qiuyedx/Documents/Github/qiuyedx-blog` 的内容系统、Markdown 渲染、Reference Gallery、视觉首页等业务能力纳入了模板升级范围，这与本仓库定位不一致。

本仓库 `qiuye-nextjs-template` 的正确定位是：

- 一个干净、纯净、通用的 Next.js 初始化模板仓库。
- 可作为创建任何新 Next.js 项目的脚手架代码来源。
- 只内置当前前端项目常用且通用的技术栈、目录结构、基础配置、主题系统、少量基础 UI 组件和少量简单通用的 qiuye-ui 组件。
- 不预设博客、内容站、图库、后台、Markdown、AI、摄影、品牌官网等特定领域。

参考博客项目的价值应被收敛为“工程实践经验”，而不是功能迁移清单：

- 可以借鉴：Next.js App Router + RSC 边界、Tailwind CSS 4 token 管理、主题系统、shadcn/ui 组件组织、全局布局、SEO metadata 写法、移动端适配经验、Dialog/Sheet 滚动锁修复、View Transition 主题切换、文档化工作流。
- 不应迁移：Markdown 文章系统、内容路由、Markdown Renderer、代码块系统、Reference Gallery、OSS 上传、评论、Twikoo、Vercel Analytics、Three.js/Canvas 视觉背景、QiuVision 品牌动效、个人内容和任何特定业务 API。

最终设计约束：

- 模板默认启动后只展示一个干净的 starter 首页和基础 About 示例，不承载业务系统。
- `components/ui/` 仅保留常用 shadcn/ui 基础组件；复杂或低频组件不堆进模板。
- `components/qiuye-ui/` 仅保留简单、通用、无业务语义的组件。
- 依赖必须克制，未被模板默认代码使用的库应删除，或移动到 README 的“可选推荐库”。
- 新项目需要 Markdown、图库、图表、地图、3D、认证、数据库、CMS 等能力时，应通过 shadcn/qiuye-ui registry、包管理器或单独 feature 分支按需添加。

## 背景

当前模板仓库已经具备：

- Next.js 15 + React 19 + TypeScript 5。
- Tailwind CSS 4。
- shadcn/ui + Radix UI 组件基础。
- `next-themes` 主题切换。
- Motion 动画库。
- `components.json` 中的 `@qiuye-ui` registry。
- 基础 `Header`、`Footer`、`ThemeProvider`、`ThemeToggle`。
- `app/globals.css` 中的 shadcn token、View Transition 样式和 Dialog/Sheet 滚动锁修复。
- 一个展示型模板首页。

参考博客仓库是一个真实项目，功能丰富，但已经具有明显领域属性。它可以帮助识别哪些工程模式经得住实战，但不能作为模板项目的功能目标。

## 目标

- 将模板打磨成“创建新项目时可以放心复制/clone 的空项目基座”。
- 保留现代 Next.js 项目最常见、最稳定、最通用的基础设施。
- 精简组件和依赖，降低新项目的删除成本。
- 形成清晰目录结构，让后续业务代码有自然落点。
- 保持 shadcn/ui 与 qiuye-ui 的按需扩展能力。
- 提供少量可运行示例，验证主题、布局、按钮、表单、弹窗、toast 等基础能力。
- README 和 Agent 指南应明确模板的边界：基础脚手架，不是业务 starter kit。

## 非目标

- 不内置 Markdown 文章系统、内容管理、博客列表、文章详情、代码块渲染、Mermaid、MDX。
- 不内置 Reference Gallery、OSS、Sharp、图片上传、备份脚本、鉴权 API。
- 不内置评论系统、统计分析、Vercel Analytics、Speed Insights。
- 不内置 Three.js、Canvas 特效、复杂 Hero、品牌动效、个人站样式。
- 不内置数据库、ORM、认证、支付、国际化完整方案、CMS。
- 不把 `/Users/qiuyedx/Documents/Github/qiuyedx-blog` 的业务文件复制进模板。
- 不为了“看起来功能多”保留未使用依赖。

## 当前模板状态

### 入口与布局

- `app/layout.tsx`
  - 根布局。
  - 渲染 `AppProviders`、`SiteHeader`、`main`、`SiteFooter`。
  - 使用 Geist 字体。
  - metadata 从 `siteConfig` 派生。

- `app/page.tsx`
  - Client Component。
  - 展示项目名、描述、快速开始命令、技术栈、基础组件示例和最少量链接。
  - 覆盖 Button、Input、Dialog、Toast 等基础能力。
  - 不包含博客、内容、AI、摄影、品牌官网等领域暗示。

- `app/about/page.tsx`
  - 纯净 About 示例页。
  - 只说明模板定位、保留能力和排除项。

- `app/globals.css`
  - Tailwind 4 CSS-first 配置。
  - shadcn/ui theme token。
  - Dialog/Sheet 滚动锁修复。
  - View Transition 主题切换样式。

### 组件

- `components/header.tsx`
  - 兼容 re-export：`Header` 指向 `components/layout/site-header.tsx`。

- `components/footer.tsx`
  - 兼容 re-export：`Footer` 指向 `components/layout/site-footer.tsx`。

- `components/layout/site-header.tsx`
  - 从 `siteConfig` 读取导航。
  - 包含项目名和 `ThemeToggle`。

- `components/layout/site-footer.tsx`
  - 从 `siteConfig` 读取项目名和外链。

- `components/providers/app-providers.tsx`
  - 组合 `ThemeProvider` 和 `Toaster`。

- `components/theme-provider.tsx`
  - next-themes provider。

- `components/theme-toggle.tsx`
  - 主题切换。

- `components/qiuye-ui/dual-state-toggle.tsx`
  - 通用双状态按钮。

- `components/ui/*`
  - 当前保留高频通用 shadcn/ui 组件：
    `avatar`、`badge`、`button`、`card`、`dialog`、`drawer`、`dropdown-menu`、`input`、`label`、`popover`、`scroll-area`、`select`、`separator`、`sheet`、`skeleton`、`sonner`、`switch`、`tabs`、`textarea`、`tooltip`。
  - `sidebar`、`table`、`pagination`、`navigation-menu`、`menubar`、`resizable` 等低频或场景型组件不默认预装。

### 依赖

当前依赖已按纯净模板收缩：

- 包管理器固定为 `pnpm@8.7.0`，`pnpm-lock.yaml` 保持 `lockfileVersion: '6.0'`。
- 默认保留：`next`、`react`、`react-dom`、`next-themes`、`lucide-react`、`motion`、当前保留 UI 组件实际需要的 Radix 包、`class-variance-authority`、`clsx`、`tailwind-merge`、`sonner`、`vaul`。
- 工具链保留：`typescript`、`tailwindcss`、`@tailwindcss/postcss`、`tw-animate-css`、`eslint`、`eslint-config-next`、`@eslint/eslintrc`、React/Node 类型包、`prettier`。
- 已移除默认代码未使用的通用库和低频组件依赖，例如 `@heroicons/react`、`@react-spring/web`、`@reactuses/core`、`ahooks`、`dayjs`、`i18next`、`react-i18next`、`lodash`、`use-clipboard-copy`、`zustand`、`react-resizable-panels` 以及已删除组件对应的 Radix 包。

## 最终模板形态

### 项目结构

最终建议结构：

```text
qiuye-nextjs-template/
├── app/
│   ├── about/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   │   ├── site-footer.tsx
│   │   └── site-header.tsx
│   ├── providers/
│   │   └── app-providers.tsx
│   ├── qiuye-ui/
│   │   └── dual-state-toggle.tsx
│   ├── ui/
│   │   └── ...
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── config/
│   └── site.ts
├── hooks/
│   └── use-mobile.ts
├── lib/
│   └── utils.ts
├── public/
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
├── README.md
└── AGENT.md
```

说明：

- `config/site.ts` 只放模板级站点名、描述、导航、外链，不放业务配置。
- `components/layout/` 放通用布局组件。
- `components/providers/` 放全局 Provider 组合，避免 `app/layout.tsx` 变重。
- `components/ui/` 只放 shadcn/ui 基础组件。
- `components/qiuye-ui/` 只放 qiuye-ui 的简单通用组件。
- 不创建 `content/`、`features/`、`scripts/`、`types/` 等业务目录，除非后续模板确实需要。

### 配置层

新增 `config/site.ts`：

```ts
export const siteConfig = {
  name: "qiuye-nextjs-template",
  description:
    "A clean Next.js starter template with TypeScript, Tailwind CSS, shadcn/ui, and theme support.",
  links: {
    github: "https://github.com/qiuyedx/qiuye-nextjs-template",
  },
  navItems: [
    { label: "首页", href: "/" },
    { label: "关于", href: "/about" },
  ],
} as const;
```

约束：

- 不提供复杂 feature flags。
- 不放业务栏目、内容类型、用户角色等领域配置。
- 新项目 clone 后只需要改这里即可替换项目名称和导航。

### App Shell

`app/layout.tsx` 应保持薄：

- 导入字体和全局 CSS。
- 配置 metadata。
- 渲染 `AppProviders`。
- 渲染 `SiteHeader`、`main`、`SiteFooter`。

`components/providers/app-providers.tsx`：

- 包装 `ThemeProvider`。
- 挂载 `Toaster`。
- 不挂载 Analytics、SpeedInsights、业务 Provider。

`components/layout/site-header.tsx`：

- 从 `siteConfig.navItems` 读取导航。
- 包含项目名或轻量 Logo 文本。
- 包含 `ThemeToggle`。
- 移动端保持简单，不引入复杂动画。

`components/layout/site-footer.tsx`：

- 显示项目名、年份、GitHub 链接。
- 不放个人社交、商业合作文案、品牌视觉背景。

### 首页

首页目标不是营销页，也不是业务应用示例，而是：

- 验证模板已正确集成 Next.js、Tailwind、主题和基础 UI。
- 展示最少量可复用示例。
- 让新项目使用者能快速删除或替换。

建议首页包含：

- 项目名和一句描述。
- 快速开始命令。
- 技术栈小列表。
- 基础组件示例区：
  - Button。
  - ThemeToggle。
  - Dialog 或 Sheet。
  - Input。
  - Toast。
- 简洁链接：GitHub、About。

首页可以使用少量 Motion 入场动画，但不应引入大型视觉背景、Bento 大版面或特定领域内容。

### About 示例页

`app/about/page.tsx` 只作为 App Router 多页面示例：

- 简短说明这是一个模板。
- 展示 `Card`、`Badge`、`Separator` 等基础组件。
- 不写个人简历、品牌理念或业务故事。

## UI 组件保留策略

### `components/ui/` 基线组件

建议保留这些高频通用 shadcn/ui 组件：

- `button`
- `card`
- `input`
- `textarea`
- `label`
- `select`
- `dropdown-menu`
- `dialog`
- `sheet`
- `drawer`
- `popover`
- `tooltip`
- `tabs`
- `badge`
- `separator`
- `switch`
- `skeleton`
- `sonner`
- `avatar`
- `scroll-area`

可根据当前模板示例是否使用再进一步收缩。

### 暂不默认保留的低频或场景型组件

以下组件不适合作为纯模板默认基线，除非 README 明确说明“预装常用全集”：

- `sidebar`
- `resizable`
- `menubar`
- `navigation-menu`
- `pagination`
- `table`
- `progress`
- `radio-group`
- `alert-dialog`
- `aspect-ratio`

这些组件都适合通过 shadcn CLI 按需添加。

### `components/qiuye-ui/` 基线组件

默认只保留：

- `dual-state-toggle`

可以考虑新增但不强制：

- `copy-button`：复制命令这类模板场景常用。
- `icon-button-with-tooltip`：如果多个地方需要图标按钮和 tooltip。

不默认迁移：

- Markdown Renderer。
- CodeBlock。
- ImageViewer。
- Typewriter。
- BentoGrid。
- BlurFade。
- DotGlass。
- MonitorMatrix。
- 任何带强视觉风格或业务语义的组件。

## 依赖策略

### 核心保留依赖

默认保留：

- `next`
- `react`
- `react-dom`
- `typescript`
- `tailwindcss`
- `@tailwindcss/postcss`
- `tw-animate-css`
- `next-themes`
- `lucide-react`
- `motion`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `sonner`
- `vaul`
- 当前保留 UI 组件实际需要的 `@radix-ui/*`

### 已移除或改为可选推荐

以下依赖不作为模板默认依赖；如果具体项目需要，应按需安装：

- `@heroicons/react`
- `@react-spring/web`
- `@reactuses/core`
- `ahooks`
- `dayjs`
- `i18next`
- `react-i18next`
- `lodash`
- `use-clipboard-copy`
- `zustand`

README 可提供“常用可选库”表格：

- 状态管理：`zustand`
- 数据请求：`@tanstack/react-query` 或 SWR
- 日期：`dayjs`
- 表单：`react-hook-form` + `zod`
- i18n：`next-intl` 或 `i18next`
- 工具：`lodash-es`
- 动效：`motion`

### 明确不进入模板默认依赖

- `gray-matter`
- `react-markdown`
- `remark-gfm`
- `rehype-raw`
- `prism-react-renderer`
- `mermaid`
- `ali-oss`
- `sharp`
- `three`
- `@react-three/*`
- `twikoo`
- `@vercel/analytics`
- `@vercel/speed-insights`

## Next.js 与工程配置

### `next.config.ts`

保持极简：

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

不默认配置：

- 远程图片通配域名。
- 静态导出。
- serverExternalPackages。
- 个人局域网 allowedDevOrigins。

README 中提供可复制片段：

- 静态导出配置。
- 远程图片域名配置。
- 自托管配置。

### TypeScript

保留严格模式和路径别名：

- `strict: true`
- `@/*`
- Next.js 默认推荐配置。

### ESLint / Prettier

- 保留 Next.js ESLint 配置。
- 保留 Prettier。
- 不引入复杂团队规则。

### Tailwind CSS 4

保留：

- CSS-first token。
- shadcn/ui CSS variables。
- `@custom-variant dark`。
- View Transition 主题切换样式。
- Dialog/Sheet 滚动锁修复。

不引入：

- QiuVision 品牌色。
- 大量自定义 keyframes。
- 复杂视觉背景工具类。

## 从参考博客借鉴但不迁移的实践

### 可借鉴

- Server Component 默认优先。
- Client Component 只用于 hooks、浏览器 API、交互和动画。
- 全局 layout 不应堆业务 Provider。
- 主题相关组件需要处理 hydration。
- 弹窗和滚动锁需要关注 sticky header 与布局抖动。
- README 和 AGENT 文档要说明目录职责和开发约束。

### 不迁移

- `lib/content.ts`
- `types/post.ts`
- `components/post/*`
- `components/markdown-renderer.tsx`
- `components/qiuye-ui/markdown-renderer/*`
- `components/qiuye-ui/code-block/*`
- `components/reference-gallery/*`
- `lib/reference-gallery-*`
- `lib/oss-*`
- `app/api/content-*`
- `app/api/reference/*`
- `content/*`
- `scripts/gallery-*`
- `components/home/monitor-matrix/*`
- `components/home/*` 中的品牌视觉组件。

## README 更新方向

README 应改成脚手架说明，而不是功能展示站说明。

建议结构：

- 项目定位：干净通用 Next.js 启动模板。
- 技术栈：Next.js、React、TypeScript、Tailwind、shadcn/ui、next-themes。
- 快速开始。
- 目录结构。
- 内置组件清单。
- 添加 shadcn/ui 组件方式。
- 添加 qiuye-ui 组件方式。
- 常用可选库推荐。
- 静态导出、远程图片、部署配置片段。
- 如何基于本模板创建新项目。

## AGENT 文档更新方向

`AGENT.md` 应强调：

- 这是纯净模板，不要默认添加领域功能。
- 新增依赖前必须确认模板默认代码会使用。
- `components/ui/` 只放 shadcn/ui。
- `components/qiuye-ui/` 只放通用 qiuye-ui 组件。
- 默认 Server Component。
- 不在模板中加入博客、Markdown、图库、认证、数据库等业务能力。
- 前端服务结束前必须关闭。

## 实施分期建议

### Phase 1：重新定义模板边界

- 更新本 final design。
- 后续新增 execution plan。
- 更新 README 和 AGENT 文档中的项目定位。

### Phase 2：目录与应用外壳轻量整理

- 新增 `config/site.ts`。
- 新增 `components/layout/site-header.tsx`、`site-footer.tsx`。
- 新增 `components/providers/app-providers.tsx`。
- 让 `app/layout.tsx` 更薄。

### Phase 3：首页纯净化

- 将首页改成通用 starter 示例。
- 保留少量组件展示。
- 去掉过度营销和领域暗示。

### Phase 4：组件基线收缩

- 审计 `components/ui/` 当前组件引用。
- 保留高频通用组件。
- 删除低频组件或记录为可通过 CLI 添加。
- 保留 `dual-state-toggle`，不迁移复杂 qiuye-ui。

### Phase 5：依赖瘦身

- 用 `rg` 检查所有依赖引用。
- 删除默认代码未使用的依赖。
- 更新 lockfile。
- README 记录可选推荐库。

### Phase 6：验证

- 执行 `pnpm lint`。
- 执行 `pnpm build`。
- 如启动 `pnpm dev` 做视觉检查，结束前关闭服务进程。

## 验证策略

每个阶段至少验证：

```text
pnpm lint
pnpm build
```

如需视觉检查：

```text
pnpm dev
```

结束前必须关闭本轮启动的前端服务进程。

检查项：

- 新 clone 后无需业务环境变量即可运行。
- 删除首页示例不会影响框架骨架。
- `app/layout.tsx` 不包含业务 Provider。
- `package.json` 没有明显未使用的大型依赖。
- `components/ui/` 不混入自研组件。
- `components/qiuye-ui/` 不混入领域组件。
- 没有 `content/`、OSS、Markdown、图库、评论、Analytics 等领域能力。

## 风险与边界情况

- 组件删减可能影响当前首页或 About 示例，需要先查引用再删。
- 某些依赖虽然当前未用，但用户可能习惯模板预装；应通过 README 的可选推荐来替代默认安装。
- 如果过度精简，模板会变成 create-next-app 的轻微包装；需要保留主题、UI、目录约定、qiuye-ui registry 这些差异化价值。
- 如果保留组件太多，模板会重新变重；应以“新项目常用且可立即复用”为判断标准。

## 明确排除

- Markdown / MDX / 内容系统。
- 博客、文档站、知识库。
- 图库、上传、OSS、Sharp。
- 评论、统计、埋点。
- 认证、数据库、后台。
- 复杂动画、3D、Canvas 背景。
- QiuVision 个人站品牌内容。

## 当前实施状态

现代化工作已按执行计划完成到 QA 阶段：

- 文档定位、App Shell、首页、About 示例页已完成纯净化。
- shadcn/ui 与 qiuye-ui 组件已完成引用审计和低频组件收缩。
- 依赖已完成审计和瘦身，lockfile 保持 pnpm 8.7.0 兼容格式。
- QA 阶段负责最终验证、文档一致性检查和交接记录。

后续如需处理 `next@15.5.7` 的安全更新提示，应单独创建 fix 包评估 Next 补丁版本兼容性，不混入纯净模板现代化主线。
