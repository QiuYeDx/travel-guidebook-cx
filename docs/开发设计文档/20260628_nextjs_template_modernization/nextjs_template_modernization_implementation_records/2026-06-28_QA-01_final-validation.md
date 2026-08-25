# 工作包 QA-01：全量验证与文档同步

## 基本信息

- 日期：2026-06-28
- 状态：已完成
- 对应执行计划工作包：QA-01 全量验证与文档同步

## 本次实现内容

- 对 final design、execution plan、README、AGENT 与当前代码状态做一致性检查。
- 更新 final design 的“当前模板状态”和依赖说明，反映已完成的 App Shell、页面、组件和依赖收缩结果。
- 更新 AGENT 的目录职责和包管理器描述，明确 `pnpm 8.7.0`。
- 更新 execution plan 的 QA-01 台账和最终下一步建议。
- 使用 pnpm 8.7.0 完成 frozen install、lint、build 验证。

## 修改文件

- `AGENT.md`
- `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_final_design.md`
- `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_execution_plan.md`
- `docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_implementation_records/2026-06-28_QA-01_final-validation.md`

## 接口或数据结构变化

- 无运行时接口变化。

## 验证结果

执行命令：

```text
rg -n '(@heroicons/react|@react-spring/web|@reactuses/core|ahooks:|dayjs:|i18next:|react-i18next|react-resizable-panels|use-clipboard-copy|zustand:|@types/lodash|@radix-ui/react-alert-dialog|@radix-ui/react-aspect-ratio|@radix-ui/react-menubar|@radix-ui/react-navigation-menu|@radix-ui/react-progress|@radix-ui/react-radio-group|@radix-ui/react-slider|@radix-ui/react-toggle)' package.json pnpm-lock.yaml
rg -n 'Markdown|markdown|博客|内容管理|仪表板|图库|OSS|评论|统计|analytics|gallery|dashboard|content' app components config hooks lib --glob '*.ts' --glob '*.tsx' --glob '*.css'
rg -n 'pnpm >= 9|lockfileVersion: '\''9\.0'\''|下一阶段应创建|建议下一个开发会话从|当前阶段的通用布局|metadata 仍偏简单|包含较多 shadcn|需要审计：' README.md AGENT.md docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_final_design.md docs/开发设计文档/20260628_nextjs_template_modernization/nextjs_template_modernization_execution_plan.md
git diff --check
CI=true npx --yes pnpm@8.7.0 install --frozen-lockfile --ignore-scripts
npx --yes pnpm@8.7.0 --version
npx --yes pnpm@8.7.0 lint
npx --yes pnpm@8.7.0 build
```

结果：

- 候选删除依赖不再作为 direct dependency 出现在 `package.json` / `pnpm-lock.yaml`。
- 源码中命中的 `Markdown`、`dashboard`、`gallery` 等词仅出现在“明确不包含/可用于任意项目”的说明文案中；`content` 命中主要来自 shadcn/ui `data-slot` 和样式类名，不是内容系统残留。
- 过时文档口径扫描无残留。
- `git diff --check` 通过。
- `CI=true npx --yes pnpm@8.7.0 install --frozen-lockfile --ignore-scripts` 成功。
- `npx --yes pnpm@8.7.0 --version` 输出 `8.7.0`。
- `npx --yes pnpm@8.7.0 lint` 通过。
- `npx --yes pnpm@8.7.0 build` 通过。

## 未完成事项

- 本包没有启动 `pnpm dev` 做浏览器视觉检查；已通过生产构建覆盖页面编译、类型检查和静态生成。
- `pnpm@8.7.0 install` 期间提示 `next@15.5.7` 有安全更新风险；本包未处理 Next 版本升级，建议单独 fix 包评估补丁版本。

## 下一步建议

- 提交当前现代化变更。
- 如要继续完善，可新建 fix 包处理 Next 安全更新提示，并重新跑 pnpm 8.7.0 install/lint/build。
