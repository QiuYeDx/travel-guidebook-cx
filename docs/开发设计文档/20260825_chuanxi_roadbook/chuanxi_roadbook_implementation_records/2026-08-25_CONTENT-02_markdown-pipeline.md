# 工作包 CONTENT-02：Markdown 内容管线

## 基本信息

- 日期：2026-08-25
- 状态：已完成
- 对应执行计划工作包：CONTENT-02

## 本次实现内容

- 为正式攻略增加可校验 frontmatter，建立服务端文件读取与缓存入口。
- 使用 `remark-gfm` 解析目录，生成与渲染端一致的中文标题锚点，并在解析阶段拒绝原始 HTML。
- 新增 `/guidebook` 静态阅读页，支持 GFM 表格、任务列表、外链、标题自链接和自适应排版。
- 桌面端提供吸附且独立滚动的目录，移动端提供原生可展开目录；长表格使用局部横向滚动。
- 在站点导航中加入“完整攻略”，并收紧 390 px 宽度下的顶部导航间距。

## 修改文件

- `content/guidebook/2026-chuanxi-grand-loop.md`
- `lib/content/types.ts`
- `lib/content/parse-guidebook.ts`
- `lib/content/guidebook.ts`
- `lib/content/parse-guidebook.test.ts`
- `components/content/markdown-renderer.tsx`
- `components/content/table-of-contents.tsx`
- `app/guidebook/page.tsx`
- `components/layout/site-header.tsx`
- `config/site.ts`
- `package.json`
- `pnpm-lock.yaml`
- `docs/开发设计文档/20260825_chuanxi_roadbook/chuanxi_roadbook_final_design.md`
- `docs/开发设计文档/20260825_chuanxi_roadbook/chuanxi_roadbook_execution_plan.md`
- 本实施记录

## 接口或数据结构变化

- `GuidebookDocument` 包含 slug、标题、描述、版本、更新日期、Markdown 正文与 H2 / H3 目录。
- `parseGuidebook(raw, slug)` 对 frontmatter、ISO 日期、首个 H1 与原始 HTML 进行硬校验。
- `getPrimaryGuidebook()` 只在服务端读取仓库内的正式攻略；没有客户端 Markdown 解析接口。
- `/guidebook` 使用攻略 frontmatter 生成页面 metadata。

## 验证结果

执行命令：

```text
pnpm test
./node_modules/.bin/tsc --noEmit
./node_modules/.bin/eslint .
./node_modules/.bin/prettier --check app/guidebook components/content components/layout/site-header.tsx config/site.ts lib/content package.json
pnpm build
git diff --check
```

结果：

- 全部 21 项测试通过，其中内容管线 5 项、行程与观景数据 16 项。
- TypeScript、ESLint、scoped Prettier 和 `git diff --check` 通过。
- Next.js 15.5.7 production build 通过，`/guidebook` 成功静态生成；页面自身 JS 为 0 B，共享首载 JS 为 183 kB。
- 浏览器在 1440 × 1000 下确认桌面目录吸附、独立滚动且锚点匹配；控制台无警告或错误。
- 浏览器在 390 × 844 下确认顶部导航无重叠、移动目录可展开并定位、17 个长表格均在自身区域滚动，页面无横向溢出。
- 依赖由 pnpm 8.7.0 安装，lockfile 保持 v6。
- 验收用前端服务仅临时使用 3100 端口，本记录完成前已关闭。

## 未完成事项

- 首页仍是轻量占位页，未读取 `Trip` / `ScenicCatalog`。
- `/itinerary`、`/days/[dayId]` 和 `/scenic` 尚未实现。
- Next.js 15.5.7 构建提示存在可用的安全更新；框架升级不属于 CONTENT-02。

## 下一步建议

- 实施 `FE-01` 行前总览工作台，用现成结构化数据替换首页占位内容，并保留 `/guidebook` 作为完整叙述入口。
