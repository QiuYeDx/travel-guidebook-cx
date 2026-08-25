# 工作包 CONTENT-01A：主线 A 沿途观景点与可视化设计

## 基本信息

- 日期：2026-08-25
- 状态：已完成
- 对应执行计划工作包：CONTENT-01A

## 本次实现内容

- 将正式攻略升级为 v0.2，按 D1-D9 补充主线 A 沿途观景台、城镇停靠、景交站点和观景走廊。
- 建立 `VP-*` / `SC-*` 稳定编号、P0 / P1 / P2 / 禁止停车分级、每日停车预算和 D-7 复核清单。
- 明确 D5 返程补拍复用规则，以及红海子、鱼子西、姊妹湖等不默认纳入主线的原因。
- 更新最终设计，加入 `/scenic`、观景数据模型、路线带交互、地图渐进增强和弱网退化。
- 更新执行计划，增加结构化观景数据与观景路线页面工作包。
- 新增 `feat/2026-08-25_chuanxi_roadbook_scenic-stops.md` 记录需求增量。

## 修改文件

- `content/guidebook/2026-chuanxi-grand-loop.md`
- `docs/开发设计文档/20260825_chuanxi_roadbook/chuanxi_roadbook_final_design.md`
- `docs/开发设计文档/20260825_chuanxi_roadbook/chuanxi_roadbook_execution_plan.md`
- `docs/开发设计文档/20260825_chuanxi_roadbook/feat/2026-08-25_chuanxi_roadbook_scenic-stops.md`
- 本实施记录

## 接口或数据结构变化

- 设计新增 `Viewpoint`、`ScenicCorridor`、`GeoRef`、`ParkingProfile`。
- 计划新增 `data/trips/2026-chuanxi/viewpoints.ts` 和 `features/scenic/*`；本工作包未写运行时代码。
- `P2`、禁止停车、景交和步行停车等级禁止设置 `parkingNavigationQuery`。

## 验证结果

执行命令：

```text
rg -n 'VP-D|SC-D|P0|P1|P2|禁止停车' content/guidebook/2026-chuanxi-grand-loop.md
rg -n '/scenic|Viewpoint|ScenicCorridor|GeoRef|ParkingProfile' docs/开发设计文档/20260825_chuanxi_roadbook/*.md
./node_modules/.bin/eslint .
```

结果：

- 文档中的 D1-D9 观景顺序、编号、停车等级和排除项完成交叉检查。
- 共 43 个 `VP-*` / `SC-*` 表格定义，编号无重复，点 / 走廊前缀与类型一致。
- 设计与执行计划均包含观景数据层和独立页面，不要求地图作为首期前置条件。
- ESLint 通过，无输出；本次未启动前端服务，无需清理常驻进程。
- `pnpm-lock.yaml` 仍为 lockfile v6，SHA-256 仍为 `17ff32f26873d81f35b5431c4c3c1c2e5d3b1e416861594be5d5876a556b6a24`。
- 本轮仅改 Markdown 文档，未重复执行 production build。

## 未完成事项

- `viewpoints.ts`、schema 校验和 `/scenic` 页面尚未实现。
- 所有 P1 / P2 候选仍需在 D-7 / D-3 核对坐标、方向、开放和国庆停车管理。
- 地图 SDK 是否需要引入，等待路线带 + 列表真实验收后决定。

## 下一步建议

- 先实施 `DATA-01`，随后实施 `DATA-02`，将攻略中的观景数据迁移为强类型事实源。
- 数据通过校验后实施 `VIEW-01`，关闭“按天查看下一处合法停靠 / 车览走廊”的移动端闭环。
