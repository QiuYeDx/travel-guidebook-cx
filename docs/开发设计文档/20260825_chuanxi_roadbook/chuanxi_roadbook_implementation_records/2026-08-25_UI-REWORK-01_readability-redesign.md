# 工作包 UI-REWORK-01：总览、单日与观景阅读重构

## 基本信息

- 日期：2026-08-25
- 状态：部分完成
- 对应执行计划工作包：UI-REWORK-01

## 本次实现内容

- 首页改为唯一的路线总览：路线摘要、D0-D9 日程、节奏说明和观景总数，不再展示行前 / 行中模式、待确认决策、来源依据和风险清单。
- 行程页移除主线 A / B / C 切换和重复的完整攻略按钮，改为最终路线时间线。
- 单日页改为“路线 / 观景 / 注意”三 Tab，使用 qiuye-ui 风格 `ClipPathTabs`，保留导航、核心停靠、必须完成事项、降级触发和住宿信息。
- 观景页移除多维筛选、路线带三栏和冗余说明，使用 `ResponsiveTabs` 在顺序列表与详情之间切换。
- 移动底部导航改为“总览 / 行程 / 观景 / 更多”，更多菜单使用 Popover，点击外部自动关闭。
- 完整攻略移动端加入跟随章节的浮动目录，使用 Popover、IntersectionObserver 和 Motion 高亮；桌面目录保持侧栏。
- Markdown 表格横向滚动边缘改为 `from-background` 语义渐变，避免浅色模式出现深色阴影。
- 正式攻略正文将主线 A 改称“最终路线”，将 B / C 改为“亚丁取消降级”和“天气或道路提前回撤”，避免用户误解为多条并行路线。

## 修改文件

- `features/trip/overview-dashboard.tsx`
- `app/page.tsx`
- `features/itinerary/day-guide.tsx`
- `features/itinerary/itinerary-timeline.tsx`
- `features/itinerary/scenic-day-index.tsx`
- `features/scenic/scenic-workspace.tsx`
- `components/layout/site-header.tsx`
- `components/layout/mobile-trip-navigation.tsx`
- `components/content/guidebook-mobile-toc.tsx`
- `components/content/markdown-renderer.tsx`
- `components/qiuye-ui/clip-path-tabs.tsx`
- `components/qiuye-ui/responsive-tabs.tsx`
- `components/qiuye-ui/segmented-control.tsx`
- `config/site.ts`
- `content/guidebook/2026-chuanxi-grand-loop.md`
- `docs/开发设计文档/20260825_chuanxi_roadbook/chuanxi_roadbook_final_design.md`
- `docs/开发设计文档/20260825_chuanxi_roadbook/chuanxi_roadbook_execution_plan.md`

## 接口或数据结构变化

- 没有改变 Trip / Scenic 数据契约。
- 新增三个本地 qiuye-ui 风格组件，均为受控 / 非受控可用的客户端组件；Tab 内容仍由 Radix Tabs 提供键盘和无障碍语义。
- `/scenic` 保留 `day` / `item` 查询参数，列表与详情切换只存在于页面会话。

## 验证结果

执行命令：

```text
corepack pnpm exec tsc --noEmit
corepack pnpm lint
corepack pnpm test
corepack pnpm build
```

结果：

- TypeScript、ESLint、57/57 测试和生产构建通过。
- 浏览器 390px 验收：首页首屏层级、移动更多菜单外部关闭、D3 单日三 Tab、观景列表 / 详情 Tab、攻略浮动目录均通过。
- 观景页 DOM 不再包含“筛选沿途条目”。

## 未完成事项

- 尚未完成真实手机安装、飞行模式冷启动和两名同行者的现场验收，归入 QA-01。
- 旧的清单实现和历史执行记录仍保留在仓库中，仅从产品导航移除；如确认不再需要，可在独立清理工作包中删除。
- 开发服务器曾出现环境 `EMFILE` watcher 警告，不影响页面响应；本轮结束前已关闭。

## 下一步建议

- QA-01 重点检查 390 / 768 / 1440 px 横向溢出、深色模式、Popover 层级和离线缓存命中。
- 若团队确认清单彻底废弃，再单独删除 `/checklists` 路由、数据和测试，避免把历史数据契约与本轮视觉重构混在一起。
