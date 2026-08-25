# 工作包 OFFLINE-01：核心路书离线

## 基本信息

- 日期：2026-08-25
- 状态：已完成
- 对应执行计划工作包：OFFLINE-01

## 本次实现内容

- 新增可安装 Web App manifest、192 / 512 px 安装图标和 Apple Touch 图标。
- 构建同源 `/sw.js`，预缓存核心路书 HTML、D0-D9 每日页、D0-D9 每日清单参数 URL、D1-D9 观景参数 URL、Next 构建资产和图标。
- 文档导航采用 4 秒超时的网络优先策略；构建静态资源采用缓存优先，失败时从版本化缓存退化。
- 新增全局离线状态条，展示路书内容版本、最近同步、准备失败和更新可用状态。
- 新 worker 保持 waiting；用户点击“刷新更新”后发送 `SKIP_WAITING`，接管后刷新并清理旧版本缓存。
- 离线同源链接强制完整文档导航；外部 HTTP(S) 链接阻止并提示复制退化，紧急电话 `tel:` 继续放行。

## 修改文件

- `app/layout.tsx`
- `app/manifest.ts`
- `app/sw.js/route.ts`
- `features/offline/offline-status.tsx`
- `lib/offline/cache-config.ts`
- `lib/offline/navigation-policy.ts`
- `lib/offline/service-worker.ts`
- `lib/offline/service-worker.test.ts`
- `public/icon-192.png`
- `public/icon-512.png`
- `public/apple-touch-icon.png`
- `package.json`

## 接口或数据结构变化

- 缓存名使用 `chuanxi-roadbook-v<contentVersion>`，只清理本项目前缀的旧缓存。
- `/sw.js?v=<contentVersion>` 使用 `no-cache` 响应头；更新 URL 和脚本内容共同触发浏览器更新检查。
- `buildOfflineCorePaths()` 是缓存范围事实源，拒绝非法日程 ID 并保证参数化 URL 可测试。
- `getOfflineLinkAction()` 区分同源文档、外部 Web 和非 Web 协议，避免离线时误拦紧急电话。
- 最近同步只存 ISO 时间，不存位置、成员或浏览历史。

## 验证结果

执行命令：

```text
corepack pnpm --version
corepack pnpm test
corepack pnpm exec tsc --noEmit
corepack pnpm lint
corepack pnpm build
git diff --check
```

结果：

- pnpm 版本保持 `8.7.0`；57/57 单元测试通过，覆盖缓存范围、参数 URL、版本名、worker 源码语法、同源 / 外部 / 电话链接策略。
- TypeScript、ESLint、production build 和 `git diff --check` 通过；构建生成 24 个路由，含 `/manifest.webmanifest` 与 `/sw.js`。
- 192 / 512 px 安装图标和 180 px Apple Touch 图标尺寸检查通过；`pnpm-lock.yaml` 保持 v6 且未修改。
- 390 x 844、768 x 1024、1440 x 1000 无横向溢出；在线新标签页控制台无错误。
- 首次在线状态显示“离线路书 v0.2 已就绪”；停止生产服务器后，D9 每日页、D9 每日执行清单、安全页和 D3 观景页仍完整可读。
- 旧 worker 对新脚本显示“路书 v0.2 有更新可用”；点击“刷新更新”后完成接管、重载，并保留 D9 参数选择。

## 未完成事项

- 当前浏览器工具没有直接飞行模式开关，本次以停止生产服务器验证真实网络不可达；QA-01 仍需至少 2 台同行者手机执行飞行模式与安装验收。
- Next.js 在服务器不可达时可能记录自动 RSC 预取失败，但点击同源链接会强制文档导航并命中缓存，不影响核心页面读取。
- 首次从未联网的设备无法获得缓存，这是 Web 平台限制；必须在出发前确认状态为“已就绪”。

## 下一步建议

- 进入 QA-01，使用至少 2 台同行者手机验证安装、飞行模式冷启动、D0-D9 切换、每日清单持久化、更新提示、外部地图退化和紧急电话链接。
- QA 发现的新行为缺口应写入 `fix/` 文档后修复，不在 CONTENT-03 复核数据中混入代码问题。
