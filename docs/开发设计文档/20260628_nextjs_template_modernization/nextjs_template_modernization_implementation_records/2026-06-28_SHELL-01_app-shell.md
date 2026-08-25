# 工作包 SHELL-01：配置层与 App Shell 轻量整理

## 基本信息

- 日期：2026-06-28
- 状态：已完成
- 对应执行计划工作包：SHELL-01 配置层与 App Shell 轻量整理

## 本次实现内容

- 新增 `config/site.ts`，集中维护模板级项目名、描述、导航和外链。
- 新增 `components/providers/app-providers.tsx`，统一挂载 `ThemeProvider` 与 `Toaster`。
- 新增 `components/layout/site-header.tsx`，从 `siteConfig.navItems` 渲染基础导航，并保留主题切换。
- 新增 `components/layout/site-footer.tsx`，从 `siteConfig.links` 渲染通用页脚链接。
- 更新 `app/layout.tsx`，让根布局只负责字体、metadata、AppProviders、SiteHeader、main 和 SiteFooter 组合。
- 将旧 `components/header.tsx` 和 `components/footer.tsx` 改为兼容 re-export，避免一次性删除影响潜在引用。

## 修改文件

- `config/site.ts`
- `components/providers/app-providers.tsx`
- `components/layout/site-header.tsx`
- `components/layout/site-footer.tsx`
- `app/layout.tsx`
- `components/header.tsx`
- `components/footer.tsx`
- `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_execution_plan.md`
- `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_implementation_records/2026-06-28_SHELL-01_app-shell.md`

## 接口或数据结构变化

- 新增 `siteConfig` 配置对象：
  - `name`
  - `description`
  - `links.github`
  - `links.nextjs`
  - `navItems`
- `Header` / `Footer` 旧导出仍保留，分别转发到 `SiteHeader` / `SiteFooter`。

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

- 旧 `components/header.tsx` / `components/footer.tsx` 仍保留为兼容导出；是否删除交给后续 UI 收缩工作包。
- 首页和 About 页面尚未纯净化，仍属于后续 `HOME-01` / `ABOUT-01` 范围。

## 下一步建议

- 继续 `HOME-01 首页纯净化`。
