# 川西同行路书执行计划

## 使用方式

每个开发会话开始前必须阅读：

- `docs/开发设计文档/20260825_chuanxi_roadbook/chuanxi_roadbook_final_design.md`
- 本执行计划。

然后：

1. 查看进度台账，选择一个 `未开始` 或 `进行中` 的最小工作包。
2. 在编辑前检查当前文件和用户已有改动；当前目录可能没有 Git 元数据，不能假设 `git status` 可用。
3. 声明工作包和预期产物，只修改该范围。
4. 使用固定的 `pnpm@8.7.0` 完成验证。
5. 更新台账，并在 `chuanxi_roadbook_implementation_records/` 新增实施记录。
6. 如实现推翻设计假设，先更新 final design，不得静默漂移。

## 状态规则

- `未开始`：尚未实施。
- `进行中`：已有变更但尚未完整验证。
- `已完成`：范围内产物完成且对应验证通过。
- `阻塞`：因外部信息或环境问题无法继续。
- `废弃`：工作包不再需要，必须写明原因。

代码写完但未验证时不能标记 `已完成`。

## 进度台账

| 工作包 | 状态 | 完成日期 | 关键文件 | 验证 | 实施记录 | Open issues |
|---|---|---:|---|---|---|---|
| INIT-01 项目领域初始化 | 已完成 | 2026-08-25 | `package.json`, `config/site.ts`, `app/*`, `README.md`, `AGENT.md`, `content/notes/README.md` | 本地 ESLint、Next production build 通过；lockfile 仍为 v6 | `chuanxi_roadbook_implementation_records/2026-08-25_INIT-01_content-and-design.md` | 首页是轻量占位，不是最终工作台 |
| CONTENT-01 完整攻略基线 | 已完成 | 2026-08-25 | `content/guidebook/2026-chuanxi-grand-loop.md` | D0-D9 日期、10 晚住宿、A/B/C 方案人工一致性检查通过 | `chuanxi_roadbook_implementation_records/2026-08-25_INIT-01_content-and-design.md` | 人数、车辆参数、驾驶员和 10/6 去留待团队确认 |
| CONTENT-01A 沿途观景点基线 | 已完成 | 2026-08-25 | 正式攻略、final design、`feat/*scenic-stops.md` | D1-D9 顺序、VP/SC 编号、停车分级和排除项交叉检查；ESLint 通过 | `chuanxi_roadbook_implementation_records/2026-08-25_CONTENT-01A_scenic-stops-design.md` | P1/P2 坐标、进出口与国庆停车需 D-7 / D-3 复核 |
| DOC-01 最终设计与执行计划 | 已完成 | 2026-08-25 | 本目录 final design / execution plan | 设计、计划、代码与攻略交叉检查通过 | `chuanxi_roadbook_implementation_records/2026-08-25_INIT-01_content-and-design.md` | 无 |
| DATA-01 结构化行程与来源模型 | 已完成 | 2026-08-25 | `data/trips/2026-chuanxi/trip.ts`, `sources.ts`, `lib/trip/*`, `package.json`, `pnpm-lock.yaml` | `test:data` 7/7、tsc、ESLint、Prettier、production build 通过 | `chuanxi_roadbook_implementation_records/2026-08-25_DATA-01_structured-trip-data.md` | 前端尚未读取数据；动态补能与道路状态按设计不入静态数据 |
| DATA-02 结构化观景点与走廊模型 | 已完成 | 2026-08-25 | `data/trips/2026-chuanxi/viewpoints.ts`, `lib/trip/types.ts`, `schema.ts`, `scenic-schema.test.ts`, `package.json` | `test:data` 总计 16/16、tsc、ESLint、Prettier、production build 通过 | `chuanxi_roadbook_implementation_records/2026-08-25_DATA-02_scenic-catalog.md` | 43 个条目均已迁移；P0/P1 坐标与入口仍待 D-7 复核，因此当前无停车导航 |
| CONTENT-02 Markdown 内容管线 | 已完成 | 2026-08-25 | `lib/content/*`, `components/content/*`, `app/guidebook/page.tsx`, 攻略 frontmatter | `test` 21/21、tsc、ESLint、Prettier、production build、390 / 1440 px 浏览器验收通过 | `chuanxi_roadbook_implementation_records/2026-08-25_CONTENT-02_markdown-pipeline.md` | 首页尚未读取结构化数据；Next.js 15.5.7 安全升级不在本包范围 |
| FE-01 行前总览工作台 | 未开始 | - | 计划：`app/page.tsx`, `features/trip/*` | lint / build / responsive QA | - | 使用真实数据替换占位页 |
| FE-02 行程时间线与每日页 | 未开始 | - | 计划：`app/itinerary/*`, `app/days/*`, `features/itinerary/*` | unit / build / responsive QA | - | 第一阶段使用路线带与深链，不引入地图 SDK |
| VIEW-01 观景路线可视化 | 未开始 | - | 计划：`app/scenic/page.tsx`, `features/scenic/*` | unit / build / responsive / weak-network QA | - | 首期路线带 + 列表，地图仅为后续增强 |
| FE-03 清单与安全页 | 未开始 | - | 计划：`app/checklists/*`, `app/safety/*`, 对应 features | unit / build / mobile QA | - | localStorage 失败需退化 |
| FE-04 行前 / 行中模式 | 未开始 | - | 计划：`features/trip/mode*`, 全局导航 | unit / build / date QA | - | 必须可手动切日和切模式 |
| FE-05 来源与复核状态 | 未开始 | - | 计划：`app/sources/*`, freshness components | unit / build | - | 过期不能等同于错误 |
| NAV-01 地图导航深链 | 未开始 | - | 计划：`lib/navigation/*`, 每日页操作 | unit / device QA | - | 不引入地图 SDK |
| OFFLINE-01 核心路书离线 | 未开始 | - | 计划：manifest、service worker、更新提示 | offline / update QA | - | 核心页面稳定后再做 |
| QA-01 全量验收 | 未开始 | - | 全仓与文档 | lint / test / build / visual / offline | - | 需至少 2 名同行者手机验收 |
| CONTENT-03 出发前最终复核 | 未开始 | - | 正式攻略、结构化来源、临时笔记 | 人工来源核验 | - | 在 9/20、9/24-25、每日执行 |

## 依赖顺序

推荐顺序：

1. 完成本轮 INIT-01、CONTENT-01、DOC-01。
2. DATA-01 建立可计算行程事实源，DATA-02 建立观景点 / 走廊事实源。
3. CONTENT-02 建立长文阅读和来源链接。
4. FE-01、FE-02、VIEW-01 关闭最小端到端路径。
5. FE-03、FE-04、FE-05 补齐旅行中能力。
6. NAV-01 提供地图深链。
7. OFFLINE-01 在页面稳定后实现缓存。
8. QA-01 全量验收。
9. CONTENT-03 按真实时间节点持续复核。

优先关闭“今天能看懂、风险能看到、路线能降级”的闭环，再添加视觉增强。

## 工作包详情

### INIT-01 项目领域初始化

目标：

- 把纯模板改为川西路书项目身份。
- 建立正式攻略和临时笔记目录。
- 更新 README 和 Agent 约束。
- 不引入新依赖，不修改 lockfile。

验收：

- 页面、metadata、README 和 AGENT 不再把项目描述为通用模板。
- `packageManager` 仍为 `pnpm@8.7.0`，lockfile 仍为 v6。
- lint 和 production build 通过。

### CONTENT-01 完整攻略基线

目标：

- 整理 9/27 至 10/6 主线 A。
- 提供亚丁取消 B 方案和天气 / 道路回撤 C 方案。
- 覆盖车辆装载、补能、高反、驾驶、住宿、预约、物资、分工和复核。
- 引用官方来源并明确规划估算。

验收：

- 日期、住宿夜数和路线方向一致。
- 动态信息有复核节点。
- 不把亚丁、补能站或道路状态写成保证。
- 一车 7 人风险清晰，不用“座位够”代替装载验证。

### CONTENT-01A 沿途观景点基线

目标：

- 按主线 A 的真实行驶顺序整理 D1-D9 观景台、城镇停靠、景交站点和无名观景走廊。
- 为项目建立稳定编号、停车等级、每日停靠预算、排除项和 D-7 复核清单。
- 为后续 `/scenic` 和每日页固定安全边界，不把“值得看”直接等同于“可以停车”。

验收：

- 所有项目都有 `VP-*` 或 `SC-*` 稳定编号，并能归属到一天和路线段。
- D3 最多 4 次、D5 最多补拍 2 次，返程不复制一组重复图钉。
- P2 / 禁止停车明确不提供停车导航；无名走廊使用区间而非虚构坐标。
- 主线排除项有方向、绕行、体力或停车依据，不因社交平台热度进入路线。

### DOC-01 最终设计与执行计划

目标：

- 固定两种模式、信息架构、数据模型、离线边界和视觉方向。
- 建立可持续的工作包和实施记录流程。

验收：

- 设计、计划、现有代码和攻略不矛盾。
- 下一会话无需依赖聊天上下文即可继续。

### DATA-01 结构化行程与来源模型

目标：

- 实现 `TripDay`、`RouteLeg`、`SourceRef`、`FallbackTrigger` 等类型。
- 将正式攻略中的日期、路线、住宿、强度和来源迁移到 `trip.ts` / `sources.ts`。
- 实现日期连续、引用有效、复核时间和范围数值验证。

验收：

- 每日数据可在 Server Component 直接读取。
- schema 错误会使测试或构建失败。
- 人工对照记录证明 Markdown 与数据一致。

### DATA-02 结构化观景点与走廊模型

目标：

- 实现 `Viewpoint`、`ScenicCorridor`、`GeoRef`、`ParkingProfile` 和相关枚举。
- 将攻略 v0.2 的 `VP-*` / `SC-*`、顺序、优先级、停车等级、方向、拍摄主题和来源迁移到 `viewpoints.ts`。
- 建立 ID、日程 / 路段引用、顺序、GeoRef 分支和停车导航权限校验。
- 使用引用关系表达 D5 从 D3 最多补拍 2 个，不复制事实数据。

验收：

- 每日可按 `sequence` 稳定得到点与走廊的混合路线序列。
- `P2`、`prohibited`、`transit-only`、`walk-only` 设置停车导航时 schema 必须失败。
- `ScenicCorridor` 只能使用 `route-interval`，不保存假中心坐标。
- 对 Markdown 的 D1-D9 编号、名称、等级、优先级和排除项完成人工对照并留档。

### CONTENT-02 Markdown 内容管线

目标：

- 服务端读取受信任 Markdown。
- 支持 GFM 表格、标题锚点、任务列表和外链。
- 禁止原始 HTML。

验收：

- 依赖使用 pnpm 8.7.0 安装，lockfile 保持 v6。
- 长表格在 390 px 宽度可用，无正文溢出。
- Markdown 解析不进入客户端包。

### FE-01 行前总览工作台

目标：

- 用真实数据替换当前占位首页。
- 展示路线结论、未决事项、预订进度、关键风险和最近复核。

验收：

- 首屏不是营销 Hero。
- 6/7 人、亚丁、车辆参数等未决项清晰可扫。
- 桌面和移动端均无卡片嵌套与文本溢出。

### FE-02 行程时间线与每日页

目标：

- 实现完整时间线和静态每日页。
- 以 A 方案为主，B/C 方案通过触发条件展示。
- 提供文本途经点和导航入口。

验收：

- 每日只有一个主目标。
- 当前日、上一日、下一日切换稳定。
- 没有地图时仍可完整理解路线。
- 每日页按路线顺序摘要展示核心停靠与车览走廊，并链接 `/scenic?day=D*`。
- D3 / D5 / D9 显示停车预算、最晚到店优先级和“剩余点改车览”的降级动作。

### VIEW-01 观景路线可视化

目标：

- 实现 `/scenic` 的按日路线带、点 / 走廊列表和详情面板。
- 实现日程、优先级、停车等级、拍摄主题、方向、复核状态筛选。
- 行中模式默认今天，由副驾 / 乘客快速识别下一处合法停靠和连续车览段。
- 预留稳定 ID 选中态用于后续地图同步，不在首期引入地图 SDK。

验收：

- 点节点与走廊线带视觉和语义不同；不能只靠颜色区分停车能力。
- 选择路线带或列表项时双向同步；键盘和触屏均可操作，不引起布局跳动。
- P0 / P1 仅在坐标与入口核准后出现停车导航；P2 / 禁停 / 景交 / 步行没有该操作。
- 空筛选、缺少坐标、过期复核、断网和外部导航不可用均有文本退化。
- 390 x 844、768 x 1024、1440 x 1000 无溢出或控件遮挡。

### FE-03 清单与安全页

目标：

- 实现行前、出发、收车清单本地持久化。
- 实现始终可达的安全和紧急联系页。

验收：

- 清单版本升级能保留匹配项。
- localStorage 不可用时仍可阅读和临时勾选。
- 危险信号和停止动作无需多层展开。

### FE-04 行前 / 行中模式

目标：

- 实现模式分段控件、模式持久化和当前日推导。
- 行中首页只展示高频执行信息。

验收：

- 中国标准时间边界测试通过。
- 手机日期错误时可手动切日。
- 首次渲染不出现明显模式闪烁。

### FE-05 来源与复核状态

目标：

- 展示来源、最后复核、下次复核和过期状态。
- 首页只提示需要行动的到期项。

验收：

- stable / seasonal / live 的计算规则有测试。
- 过期信息仍可看到来源和旧结论，不被静默删除。

### NAV-01 地图导航深链

目标：

- 为每段路线生成安全编码的外部地图查询。
- 为已核准的 P0 / P1 停车入口生成安全编码的外部地图查询。
- 提供复制地点 / 途经点 / 观景走廊起止标签的退化能力。

验收：

- 中文地点、多个途经点和未安装 App 场景均有验证。
- P2、禁止停车、景交和步行点无法调用停车导航；同名点必须通过核准后的查询词 / 坐标区分。
- 顺行 / 返程入口说明随深链展示，错过入口的默认动作是继续前行。
- 不包含个人实时位置，不声称替代导航。

### OFFLINE-01 核心路书离线

目标：

- 缓存首页、行程、每日页、清单、安全页和必要静态资产。
- 显示内容版本和更新提示。

验收：

- 首次在线访问后，飞行模式下核心页面可读取。
- 新版本发布后能明确提示，不长期卡在旧缓存。
- 外部动态链接在离线时有合理退化。

### QA-01 全量验收

目标：

- 完成自动、视觉、离线、可访问性和真实设备验收。
- 同步设计、计划、README 和实施记录。

验收：

- 固定 pnpm 版本下 lint、test、build 通过。
- 390 × 844、768 × 1024、1440 × 1000 通过视觉检查。
- 至少 2 名同行者能在手机上完成“找今天路线、查看补能、切 B 方案、打开安全页”。

### CONTENT-03 出发前最终复核

目标：

- 在 D-7、D-3 和每天前一晚核对动态来源。
- 将最终酒店、预约和补能结果写入受控临时笔记 / 结构化数据。
- D-7 用至少两个地图端复核保留的 `VP-*` 坐标、同名歧义、顺 / 返程入口、停车类型和近期状态。
- D-3 按天气、管制、近期停车信息和每日预算确定最终核心点；未通过复核的 P1 降为 P2 或删除导航。

验收：

- 关键动态信息没有过期警告未处理。
- 每个保留的 P1 点有复核日期和入口方向；P2 / 禁停列表与可导航停车收藏人工比对无混入。
- 订单信息只写负责人和状态，不写敏感凭据。
- 任何路线变化都同步 A/B 方案和每日页。

## 不可违反约束

- 不使用不确定版本的全局 pnpm 更新 lockfile。
- 启动前端服务后，回答结束前必须关闭本轮服务进程。
- 不把动态信息硬编码为长期可靠事实。
- 不把医疗提示写成诊断或继续冒险的依据。
- 不收集同行者敏感信息或实时精确位置。
- 不引入大型地图、图表、CMS、认证或数据库来完成首期阅读闭环。
- 不把重要路线信息只放在图片、颜色或地图上。
- 不把无名景观走廊伪造成地图图钉，不向 P2 / 禁停点提供停车导航。
- 不要求驾驶员行驶中操作观景页面；沿途观察和候选判断交给副驾 / 乘客。
- 不复制 qiuvision 的业务代码和个人品牌资产。

## 实施记录模板

每次完成工作包后，在：

```text
docs/开发设计文档/20260825_chuanxi_roadbook/chuanxi_roadbook_implementation_records/
```

新增：

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

## 下一会话建议

下一工作包应为 `FE-01`，用现成 `Trip` / `ScenicCatalog` 替换首页占位内容，建立行前总览工作台。
随后实施 `FE-02` 的行程时间线和每日页，再由 `VIEW-01` 完成 `/scenic` 路线带与列表。
