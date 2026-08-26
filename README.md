# 川西同行路书

面向 2026 年中秋、国庆川西大环线自驾的共享路书项目。使用者预计为 6 至 7 名朋友，
从成都集结，驾驶一辆蔚来 ES8，以公路观景、低体力消耗和可随时降级为主要原则。

项目同时服务两个阶段：

- 行前：讨论路线、关闭关键决策、分配预订和物资任务。
- 行中：快速查看当天路线、风险、补能、预约与备选方案。

## 当前状态

本轮完成项目初始化和内容基线，前端仍处于轻量占位阶段：

- 文档：`content/guidebook/2026-chuanxi-grand-loop.md`
- 临时笔记约定：`content/notes/README.md`
- 开发设计：`docs/开发设计文档/20260825_chuanxi_roadbook/`

路线、车程和海拔是规划信息；票务、路况、天气、充换电和营业状态是动态信息，
必须按攻略里的 D-7、D-3 和每日清单复核。

## 技术栈

- Next.js 15 App Router
- React 19 + TypeScript 5
- Tailwind CSS 4
- shadcn/ui + Radix UI
- qiuye-ui registry
- next-themes、lucide-react、Motion
- pnpm 8.7.0

## 本地开发

要求 Node.js 20 或更高版本。项目固定使用 pnpm 8.7.0，避免用新版 pnpm 重写
lockfile v6。

```bash
corepack pnpm --version
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

如果本机 Corepack 没有准备对应版本，可显式使用：

```bash
npx --yes pnpm@8.7.0 install --frozen-lockfile
npx --yes pnpm@8.7.0 dev
```

常用验证：

```bash
npx --yes pnpm@8.7.0 lint
npx --yes pnpm@8.7.0 build
```

## 目录职责

```text
app/                    Next.js 页面与布局
components/layout/      全局 Header / Footer
components/providers/   全局 Provider
components/qiuye-ui/    通用 qiuye-ui 组件
components/ui/          shadcn/ui 基础组件
config/                 站点配置
content/guidebook/      可版本化的正式攻略
content/notes/          讨论纪要、预订和复核记录
docs/开发设计文档/      最终设计、执行计划和实施记录
hooks/                  通用 React hooks
lib/                    通用工具
public/                 本地静态资源
```

## 内容规则

- `guidebook/` 保存已经整理过、可作为讨论基线的内容。
- `notes/` 保存会议纪要、候选住宿、临时复核结果；不要写身份证号、病史等敏感信息。
- 事实必须标记来源和复核日期；动态结论必须写下一次复核时间。
- 每日路线只有一个 A 方案，备选方案必须附清晰触发条件。
- 真实导航以车机和地图应用为准，本项目不替代实时交通导航。

## UI 与依赖规则

- 默认使用 Server Component，只在交互和浏览器能力需要时使用 Client Component。
- `components/ui/` 只放 shadcn/ui 组件，业务组件放到后续 `features/` 领域目录。
- 图标优先使用 `lucide-react`。
- qiuye-ui 组件按实际工作包安装，不把 registry 组件当作无条件依赖。
- 新增依赖必须同时说明用途、体积影响、服务端/客户端边界和替代方案。

详细架构和阶段计划见开发设计文档。
