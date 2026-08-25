# 工作包 FE-03：清单与安全页

## 基本信息

- 日期：2026-08-25
- 状态：已完成
- 对应执行计划工作包：FE-03

## 本次实现内容

- 建立行前、每日出发和每日收车三套结构化清单，内容与正式攻略一致。
- 以 `tripId::checklistInstanceId::versionedItemId` 建立稳定项键，按日实例化 D0-D9 出发 / 收车清单。
- 实现 localStorage 持久化、旧版匹配项保留、新项默认未勾选、仅重置当天和全部确认重置。
- 读写 localStorage 失败时保留当前页内存状态，并显示刷新可能丢失的文本提示。
- 实现高海拔危险信号、驾驶停止条件、现场行动和 `110` / `119` / `120` / `122` 电话链接。
- 全局导航收敛为总览、行程、观景、清单、安全 5 个高频入口，完整攻略与项目说明移到页脚。
- 浏览器验收发现并修复深色偏好下主题按钮首帧 hydration mismatch。

## 修改文件

- `data/trips/2026-chuanxi/checklists.ts`
- `data/trips/2026-chuanxi/safety.ts`
- `features/checklist/checklist-model.ts`
- `features/checklist/checklist-model.test.ts`
- `features/checklist/checklist-workspace.tsx`
- `features/safety/safety-guide.tsx`
- `app/checklists/page.tsx`
- `app/safety/page.tsx`
- `config/site.ts`
- `components/layout/site-footer.tsx`
- `components/theme-toggle.tsx`
- `app/about/page.tsx`
- `package.json`

## 接口或数据结构变化

- 新增 `ChecklistDefinition` / `ChecklistItem` / `ChecklistScope` 结构和内容版本 `1.0`。
- 本机快照格式为 `{ schemaVersion, contentVersion, checkedItemKeys }`，存储键为 `travel-guidebook:checklists:<tripId>`。
- 勾选项键由 `tripId + checklistId + itemId` 构成；每日清单的 `checklistId` 包含 D0-D9 实例 ID。
- 新增通用风险识别数据，不包含个人病史、诊断或用药方案。

## 验证结果

执行命令：

```text
pnpm --version
pnpm test
pnpm exec tsc --noEmit
pnpm lint
pnpm exec prettier --write <FE-03 scoped files>
pnpm build
git diff --check
```

结果：

- pnpm 版本为 `8.7.0`，`pnpm-lock.yaml` 仍为 v6 且本包未修改 lockfile。
- 单元测试 38/38 通过；覆盖版本化 ID、快照解析、升级合并、按范围重置和进度计算。
- TypeScript、全仓 ESLint、Prettier、production build 和 `git diff --check` 通过。
- `/checklists` 为静态页，页面 JS 16.6 kB；`/safety` 为无额外客户端包的静态页。
- 浏览器在 390 x 844、768 x 1024、1440 x 1000 与深色模式下无横向溢出。
- 已验证勾选进度、刷新持久化、D0-D9 切日、D3 仅重置当天确认文案、电话 href、主题首帧与控制台无误。

## 未完成事项

- 当前浏览器控制环境无法完整模拟隐私模式禁用 localStorage；读写异常的 catch 退化已在代码层实现。
- 真实拨号确认由设备和用户完成，本次只验证 `tel:` 链接契约。

## 下一步建议

- 进入 FE-04，实现行前 / 行中模式、中国标准时间当前日推导与手动切日。
- FE-04 复用本包的每日实例 ID，行中模式从当天清单直接入口打开。
