# 川西同行路书最终开发设计

## 评审结论

现有 Next.js 模板提供了可靠的 App Router、主题、shadcn/ui、qiuye-ui registry 和基础布局，
适合作为应用骨架；用户附带的 AI 路线讨论正确抓住了“渐进海拔、轻徒步、低海拔恢复夜、亚丁可取消”
四个核心，但路线拓扑、满员装载、纯电补能、动态信息时效和旅行中使用方式仍需要工程化收敛。

最终方案采用“内容先行、结构化数据驱动、两种使用模式、动态信息显式过期”的路线：

- Markdown 保存完整攻略、依据和讨论语境。
- TypeScript 结构化数据保存前端高频读取的日期、路段、状态、触发条件和复核时间。
- 行前模式强调对比、未决事项和预订；行中模式只突出今天、下一步、风险和降级。
- 沿途观景采用“按日路线带 + 停靠点 + 观景走廊”，不把无名风景伪造成可导航图钉。
- 地图只提供线路理解和导航深链，不替代车机实时导航。
- 第一阶段无账户、数据库和 CMS；离线能力在核心阅读路径稳定后实现。

开发期间不可违反的最终约束：

1. 包管理器固定为 `pnpm@8.7.0`，lockfile 保持 v6。
2. 稳定、季节和实时信息必须在数据层可区分，动态信息必须展示复核时间。
3. 一天只能有一个 A 方案；B 方案必须有机器可读的触发条件和人工说明。
4. 移动端、弱网和单手扫描优先，不把重要信息藏在地图或长文中。
5. 不在仓库或浏览器持久化身份证、详细病史、订单密码和实时精确位置。
6. 应用不声称提供医疗诊断、实时路况或实时充换电保证。
7. `P2`、禁止停车和未核准坐标不得生成停车导航；驾驶员只接收路线决策，沿途观察由乘客完成。

## 背景

项目服务约 6 至 7 名朋友在 2026 年 9 月 27 日至 10 月 6 日的川西自驾。使用阶段跨度明显：

- 8 月至 9 月：共同讨论路线、人员、车辆、住宿、预约和预算。
- 旅行前一周：密集复核天气、道路、票务和充换电。
- 旅行中：在手机上快速找到当天路线、下一站、最晚时间、补能和风险。
- 旅行后：可选保留实际轨迹、费用和复盘，但不在首期范围。

单纯渲染一篇长 Markdown 能满足“阅读”，但不能很好满足黄金周山路上的快速决策；
单纯把路线硬编码成卡片又会丢失讨论依据和版本历史。因此需要内容与结构化数据分层。

## 目标

- 建立唯一、可版本化的正式路书和临时笔记规范。
- 提供路线总览、每日路书、风险、补能、预约、物资和未决事项的可视化。
- 按实际行驶顺序呈现知名观景台、城镇停靠、景交站点和无名观景走廊，并显示停车可信度。
- 支持“行前讨论”和“旅行中执行”两种信息组织方式。
- 在手机弱网环境下仍可读取关键静态内容。
- 明确展示事实来源、复核日期和过期状态。
- 允许未来新增其他旅行，但不过早建设通用 CMS。

## 非目标

- 不做实时车队定位、实时天气、实时道路或实时充换电平台。
- 不替代高德 / 百度 / 车机导航。
- 不做酒店、景区或充电站预订交易。
- 不做医疗诊断或个体用药建议。
- 首期不做用户系统、多人在线编辑、评论、数据库、后台管理。
- 首期不接入需要商业密钥的地图 SDK。
- 不复制 qiuvision 博客的业务代码或品牌资产，只参考其克制、清晰的视觉节奏。

## 当前仓库状态

### 技术基线

- `package.json`：Next.js 15.5.7、React 19、TypeScript 5、Tailwind CSS 4。
- `packageManager` 固定为 `pnpm@8.7.0`。
- `pnpm-lock.yaml` 为 lockfile v6，本功能初始化不修改 lockfile。
- `components/ui/` 已有 Button、Card、Tabs、Drawer、Sheet、ScrollArea、Tooltip 等基础组件。
- `components/qiuye-ui/` 已有主题切换相关组件，`components.json` 配置了 qiuye-ui registry。
- `tsx` 作为开发依赖运行纯 TypeScript 数据契约测试，不进入客户端生产包。

### 已初始化内容

- `config/site.ts`：站点名称和导航已改为川西同行路书。
- `app/page.tsx` / `features/trip/*`：基于真实 `Trip` / `ScenicCatalog` 的行前总览和行中当日执行工作台。
- `app/about/page.tsx`：项目边界与原则。
- `content/guidebook/2026-chuanxi-grand-loop.md`：v0.2 正式攻略和主线 A 沿途观景基线。
- `content/notes/README.md`：讨论与复核记录约定。
- `data/trips/2026-chuanxi/trip.ts`：D0-D9 主线 A、B/C 降级方案和触发条件事实源。
- `data/trips/2026-chuanxi/sources.ts`：7 个来源及复核时间事实源。
- `data/trips/2026-chuanxi/viewpoints.ts`：43 个沿途点 / 走廊、D1-D9 停靠策略和 D5 复用事实源。
- `data/trips/2026-chuanxi/planning.ts`：六项待决、五项预订 / 复核任务及截止日期快照。
- `lib/trip/types.ts` / `schema.ts`：共享类型、交叉引用和范围校验。
- `lib/trip/planning.ts`：行前快照的行程归属、ID、日期与截止窗口校验。
- `lib/content/*`：服务端读取 Markdown、校验 frontmatter、拒绝原始 HTML 并生成稳定中文目录。
- `components/content/*`：GFM 长文渲染、表格滚动容器及桌面 / 移动端目录。
- `app/guidebook/page.tsx`：构建时静态生成的完整攻略阅读页。
- `app/itinerary/*` / `app/days/*` / `features/itinerary/*`：D0-D9 时间线、静态每日页、停车预算和降级动作。
- `app/scenic/page.tsx` / `features/scenic/*`：按日路线带、五类筛选、列表 / 详情同步与离线文本退化。
- `app/checklists/page.tsx` / `data/trips/2026-chuanxi/checklists.ts` / `features/checklist/*`：版本化行前、每日出发和收车清单，支持本机持久化、按日重置和内存退化。
- `app/safety/page.tsx` / `data/trips/2026-chuanxi/safety.ts` / `features/safety/*`：直接展示高海拔危险信号、驾驶停止条件、现场动作和紧急电话。
- `features/trip/mode-model.ts` / `trip-mode-provider.tsx`：中国标准时间当前日推导、手动 D0-D9 覆盖和本机模式偏好。
- `components/layout/mobile-trip-navigation.tsx`：行中优先的移动端底部导航，当天清单和观景页使用日程深链。
- `app/sources/page.tsx` / `features/sources/*`：7 项来源目录、中国标准时间复核状态、引用日程与首页到期行动提示。
- `lib/navigation/map-links.ts` / `features/navigation/copy-action.tsx`：生成只包含公开路线信息的高德 HTTPS URI、核准停车入口坐标导航和路线 / 观景复制退化。
- `AGENT.md`：项目级开发、内容、pnpm 和服务进程约束。

### 已知限制

- `/scenic` 筛选与选中态当前只保留在页面会话和 URL 中，不做跨日持久化；行中首页和移动导航会传入当前日。
- 每日页和行中首页使用高德 HTTPS URI 尝试唤起 App，并同时提供可粘贴到车机或同行群的路线文本；未安装 App 时由 URI Web 页面或复制操作退化。
- 所有 P0 / P1 点仍待 D-7 坐标与停车入口复核，当前数据不提供停车导航。
- 没有离线缓存和 PWA manifest。
- 清单状态只存在当前设备的当前浏览器；清理站点数据、更换浏览器或设备时不同步。
- 中国标准时间当前日推导、手动切日、模式持久化与来源过期状态已实现。
- `/checklists` 为了在首次响应中精确打开 D0-D9 每日执行清单，在服务端解析 `view` / `day` 查询参数；OFFLINE-01 需将这些参数 URL 纳入核心缓存。
- 当前 7 项来源中没有 `live` 类型；实时状态规则已有单元测试，待后续真实数据验证页面状态。

## 信息架构

### 一级页面

| 路由            | 行前模式                                     | 行中模式                                       |
| --------------- | -------------------------------------------- | ---------------------------------------------- |
| `/`             | 路线结论、未决事项、预订进度、关键风险       | 今天、下一段、最晚到达、补能、住宿、紧急降级   |
| `/itinerary`    | 10 天时间线、A/B 方案切换、海拔与驾驶强度    | 当前日前后 1 天，快速切日                      |
| `/days/[dayId]` | 单日完整讨论、可选点和依据                   | 单日执行卡、时间线、导航入口、收车清单         |
| `/scenic`       | 按日筛选全部停靠点、走廊、停车等级与待复核项 | 默认仅看今天，突出下一处合法停靠和连续车览路段 |
| `/checklists`   | 行李、车辆、预订、角色分工                   | 出发前 / 收车清单，可本地勾选                  |
| `/safety`       | 高反、驾驶、道路与紧急预案                   | 危险信号、紧急电话、立即降级动作               |
| `/notes`        | 版本化临时笔记索引                           | 默认隐藏在“更多”，仅查阅已同步内容             |
| `/sources`      | 来源、复核记录和过期项                       | 只突出今天相关的过期信息                       |

### 导航

桌面端使用紧凑顶部导航和页面内侧栏；移动端使用顶部当天标题加底部 4 项导航：
“今天、行程、清单、更多”。“更多”承载安全、来源、项目说明和主题切换。

不在全局导航里放超过 5 个一级入口。行中模式下“今天”必须一触可达。

## 两种模式

### 行前模式 `planning`

- 默认用于 9 月 27 日以前。
- 展示完整路线、A/B 方案、未决事项、负责人和截止日期。
- 允许查看信息来源、历史笔记和所有可选项。
- 视觉密度适中，适合桌面端共同讨论。

### 行中模式 `onTrip`

- 可由用户手动切换，也可在 9 月 27 日后建议切换，但不自动强制。
- 首页根据中国标准时间和行程日期推导当前日。
- 首屏固定顺序：当前日状态 → 下一段 → 风险 / 复核警告 → 补能 → 住宿 → 导航操作。
- 可选景点和长背景折叠到次级区域。
- 模式偏好只存 `localStorage`，不上传。

模式控制使用带明确标签的分段控件，不用只有图标的陌生按钮。

## 内容与数据模型

### 目录设计

```text
content/
  guidebook/
    2026-chuanxi-grand-loop.md
  notes/
    README.md
    YYYY-MM-DD_topic.md
data/
  trips/
    2026-chuanxi/
      trip.ts
      viewpoints.ts
      sources.ts
features/
  trip/
  itinerary/
  scenic/
  checklist/
  safety/
lib/
  content/
  trip/
```

`data/` 和 `features/` 在对应工作包开始时创建，不在初始化阶段放空目录。

### 核心类型

```ts
type Freshness = "stable" | "seasonal" | "live";
type VerificationStatus = "verified" | "needs-review" | "expired";
type DayStatus = "planned" | "confirmed" | "changed" | "cancelled";
type Intensity = "low" | "low-medium" | "medium" | "medium-high";

type SourceRef = {
  id: string;
  title: string;
  url: string;
  publisher: string;
  freshness: Freshness;
  verifiedAt: string;
  reviewAt?: string;
};

type RouteLeg = {
  id: string;
  from: string;
  to: string;
  via: string[];
  distanceKmEstimate?: [number, number];
  driveMinutesEstimate?: [number, number];
  navigationQuery: string;
  targetArrivalSoc?: number;
  latestArrival?: string;
};

type FallbackTrigger = {
  id: string;
  category: "health" | "weather" | "road" | "booking" | "vehicle" | "time";
  condition: string;
  action: string;
  severity: "warning" | "switch-plan" | "stop";
};

type TripDay = {
  id: string;
  dayNumber: number;
  date: string;
  title: string;
  status: DayStatus;
  intensity: Intensity;
  overnight: { place: string; altitudeMEstimate?: [number, number] };
  primaryGoal: string;
  legs: RouteLeg[];
  mustDo: string[];
  optional: string[];
  skip: string[];
  fallbackTriggers: FallbackTrigger[];
  sourceIds: string[];
};

type FallbackPlanDay = {
  date: string;
  routeSummary: string;
  overnight?: string;
  primaryGoal: string;
};

type FallbackPlan = {
  id: "B" | "C";
  title: string;
  description: string;
  triggerMode: "any" | "all";
  triggers: FallbackTrigger[];
  days: FallbackPlanDay[];
  priorities?: string[];
};

type Trip = {
  id: string;
  name: string;
  contentVersion: string;
  timezone: "Asia/Shanghai";
  startDate: string;
  endDate: string;
  primaryPlanId: "A";
  days: TripDay[];
  fallbackPlans: FallbackPlan[];
  sourceIds: string[];
};

type ViewpointKind = "viewpoint" | "scenic-shuttle" | "town-stop" | "candidate";
type ViewpointPriority = "core" | "optional" | "drive-by";
type ParkingLevel =
  "P0" | "P1" | "P2" | "prohibited" | "transit-only" | "walk-only";
type TravelDirection = "outbound" | "return" | "both";
type ScenicSubject =
  | "snow-mountain"
  | "mountain"
  | "valley"
  | "road"
  | "grassland"
  | "river"
  | "wetland"
  | "village"
  | "town"
  | "forest"
  | "lake"
  | "geology"
  | "architecture"
  | "culture";

type GeoRef =
  | {
      kind: "exact";
      lat: number;
      lng: number;
      coordinateSystem: "gcj02";
      mapQuery: string;
      verifiedAt: string;
    }
  | {
      kind: "route-interval";
      routeLegId: string;
      fromLabel: string;
      toLabel: string;
    }
  | { kind: "none"; reason: string };

type ParkingProfile = {
  level: ParkingLevel;
  verificationStatus: VerificationStatus;
  parkingNavigationQuery?: string;
  entryDirectionNote?: string;
  capacityNote?: string;
  note: string;
};

type Viewpoint = {
  id: `VP-${string}`;
  dayId: string;
  routeLegId?: string;
  sequence: number;
  title: string;
  kind: ViewpointKind;
  priority: ViewpointPriority;
  direction: TravelDirection;
  subjects: ScenicSubject[];
  geoRef: GeoRef;
  parking: ParkingProfile;
  stayMinutesEstimate?: [number, number];
  sourceIds: string[];
};

type ScenicCorridor = {
  id: `SC-${string}`;
  dayId: string;
  routeLegId: string;
  sequence: number;
  title: string;
  priority: "core" | "drive-by";
  direction: TravelDirection;
  subjects: ScenicSubject[];
  geoRef: Extract<GeoRef, { kind: "route-interval" }>;
  parking: ParkingProfile;
  passengerCue: string;
  sourceIds: string[];
};

type ScenicItem = Viewpoint | ScenicCorridor;

type ScenicDayPlan = {
  dayId: string;
  mode: "road-stops" | "scenic-transit" | "reuse";
  photoStopBudget?: [number, number];
  note: string;
  reuse?: {
    sourceDayId: string;
    maxSelections: number;
    itemIds: `VP-${string}`[];
  };
};

type ScenicCatalog = {
  tripId: string;
  contentVersion: string;
  items: ScenicItem[];
  dayPlans: ScenicDayPlan[];
};
```

观景数据校验必须保证：`VP-*` / `SC-*` ID 唯一且引用有效；同一天 `sequence` 可稳定排序；
`P2`、`prohibited`、`transit-only`、`walk-only` 不得设置 `parkingNavigationQuery`；只有完成坐标复核的
`exact` 点才能显示停车导航，且必须声明经 D-7 / D-3 复核的 `gcj02` 坐标系。`route-interval` 只表达线路区间，不能自动取中点冒充停车位置。
D5 通过 `ScenicDayPlan.reuse` 引用 D3 点位并限制最多选择 2 个，不复制第二套数据。

### 单一事实源规则

- 日期、住宿地、路线段、强度、目标电量和触发条件以 `trip.ts` 为前端事实源。
- 观景点、观景走廊、顺序、停车等级和复核状态以 `viewpoints.ts` 为前端事实源。
- `guidebook.md` 保存完整叙述和可打印版本；结构化数据迁移完成后，不再手工复制可计算值。
- 页面根据 `sourceIds` 读取来源和复核状态，不在组件中硬编码“已核实”。
- 稳定来源无 `reviewAt` 时保持 `verified`；稳定 / 季节来源在 `reviewAt` 前 7 天进入 `needs-review`，超过复核日进入 `expired`。
- 实时来源在 `verifiedAt` 当天为 `verified`，次日起为 `needs-review`，超过 `reviewAt` 为 `expired`。`expired` 只表示不再具有当日时效，不表示旧结论已错。
- `pnpm test:data` 验证日期唯一、天数连续、ID、来源、`reviewAt`、数值范围和 B/C 方案完整性；
  production build 同时完成 TypeScript 形状检查。

首个数据迁移工作包必须对 Markdown 与 `trip.ts` 做一次人工对照并记录；迁移完成前 Markdown 仍是基线。

## 前端模块职责

### `features/trip`

- 模式切换和当前日期推导。
- Trip 概览、未决事项、角色和住宿摘要。
- 只管理本地模式偏好，不管理勾选状态。

### `features/itinerary`

- 10 天时间线、日卡和单日详情。
- A/B 方案状态和触发条件。
- 导航深链生成；不能假设目标应用已安装。

### `features/scenic`

- 渲染按日路线带、连续观景走廊、停靠节点、当日停车预算和返程补拍关系。
- 提供日程、优先级、停车等级、拍摄主题、行驶方向和复核状态筛选。
- 管理路线带、列表和未来可选地图之间的选中态同步；不持有事实数据。
- 严格按 `ParkingProfile` 决定操作：可导航、只复制名称、仅车览或景交 / 步行提示。

### `features/checklist`

- 行前、每日出发、每日收车清单。
- 勾选状态按 `tripId + checklistId + itemId` 存 localStorage。
- 提供“仅重置今天”和“全部重置”，重置需确认。
- 内容版本变化时保留能匹配的 itemId，新增项默认未勾选。

### `features/safety`

- 高反危险信号、驾驶停止条件和紧急电话。
- 紧急操作不隐藏在 Accordion 深处。
- 电话链接使用 `tel:`，点击前仍由设备确认拨号。

### `lib/content` / `lib/trip`

- Markdown 读取与 frontmatter 解析。
- 结构化数据校验、复核状态计算和日期推导。
- 纯函数优先，便于单元测试。

## Markdown 方案

已使用 `gray-matter` + `remark` / `remark-gfm` 实现轻量服务端解析，并由
`react-markdown` + `rehype-slug` 渲染受信任仓库内容。依赖由 pnpm 8.7.0 安装，lockfile 保持 v6。

解析阶段遇到原始 HTML 直接失败，渲染阶段同时使用 `skipHtml`，不引入 `rehype-raw`。
`github-slugger` 与 `rehype-slug` 共用相同标题命名规则，保证目录和中文标题锚点一致。桌面目录独立吸附滚动，
移动目录使用原生 `details`；长表格只在自身受限容器横向滚动，不造成页面级溢出。
攻略在 Server Component 中读取并静态生成，Markdown 解析代码不进入客户端包。

## 地图与导航

### 第一阶段

- 路线用文本、时间线、城市节点和 `/scenic` 路线带表达。
- 路线带以实际行驶顺序连接节点；`Viewpoint` 用点节点，`ScenicCorridor` 用有起止标签的线段带，
  没有核准坐标时仍能完整工作。
- 每段提供 `https://uri.amap.com/search` 查询 URI，中文地点和多个途经点通过 `URLSearchParams` 编码；URI 尝试唤起高德 App，未安装时保留 Web 页面。
- 每段同时提供复制路线，包含起点、依序途经点、终点和公开搜索词；Clipboard API 不可用时退化到临时只读文本域复制。
- `P0` / `P1` 只有在精确位置和停车入口已复核后才显示停车导航；`P2` 只显示“乘客观察 / 现场判断”，
  禁止停车和景交 / 步行节点不生成社会车辆停车操作。
- 停车导航使用核准查询词和 GCJ-02 经纬度消歧；顺行 / 返程入口说明进入复制文本，所有观景文本固定提示错过入口继续前行、不倒车、不急刹。
- 离线时隐藏外部地图操作，但路线、地点或走廊区间复制仍可使用。
- 深链只包含公开地点名称，不包含成员实时位置。
- 页面明确提示实时路线以车机当日结果为准。

### 后续评估

如果静态线路理解仍不足，再评估 MapLibre + 自托管 / 合规公开底图。地图与列表共享稳定 ID：
点击路线带节点、列表项或地图要同步选中和滚动位置；精确点使用图钉，观景走廊使用沿路线的线带，
`GeoRef.kind === "none"` 不上地图。不得为了装饰性地图引入密钥、大体积 SDK 或离线瓦片版权问题。

### `/scenic` 页面交互

- 默认按 D1-D9 和 `sequence` 展开；行中模式只展开今天，并保留前后日快捷切换。
- 顶部为稳定高度的日程分段控件；其下是可横向滚动的优先级、停车、主题、方向、复核状态筛选。
- 主视图是路线带与对应列表，不要求地图加载成功。选择节点时显示拍摄对象、预计停留、停车结论、
  最晚放弃条件和来源复核状态。
- `ScenicCorridor` 显示“从 A 到 B”的连续范围和乘客观察提示，不显示虚假距离或中心坐标。
- D3 显示“最多 4 次”、D5 显示“从 D3 最多补拍 2 个”等预算约束；达到预算后剩余候选自动降为车览建议。
- 空筛选显示“没有符合条件的点”并提供清除筛选；数据不完整时保留文本次序和复核提醒。

## 离线与弱网

离线是第二阶段能力，但架构从一开始避免依赖运行时 API：

- 核心内容在构建期生成。
- 图片使用本地优化资产并控制尺寸。
- 清单和模式在本地保存。
- PWA 工作包缓存 App Shell、正式路书、所有每日页、安全页和必要图标。
- 显示“内容版本 / 最后同步”，不能让用户误以为离线缓存是实时数据。
- 断网时隐藏或禁用需要网络的外部导航和来源访问，并保留文本地址。
- `/scenic` 离线时保留路线带、停靠顺序、停车等级、拍摄提示和最后复核时间；地图区域若存在则退化为文本列表。
- 行驶中不要求驾驶员浏览或操作观景页。由副驾 / 乘客提前查看下一段；语义标签必须明确区分“可停车”与“仅乘客观察”。

## 视觉与交互设计

### 方向

视觉参考 qiuvision 的克制、阅读节奏和细节品质，不复制其个人品牌组件。路书定位是安静、实用的
旅行操作工具：白 / 炭黑作为阅读底色，使用高山绿表达路线，安全橙表达需要复核，红色只用于停止 / 危险。
深色模式采用中性灰黑，不做大面积深蓝或单一绿色主题。

### 布局

- 不做营销 Hero；首屏直接展示行程状态。
- 页面区块使用无框分带布局，卡片只用于每日条目、清单组和独立警告。
- 不嵌套卡片。
- 桌面最大阅读宽度约 1120 px；长文正文约 720 px。
- 移动端操作目标不小于 44 px，底部导航和模式切换保持稳定尺寸。

### 排版

- 中文正文优先系统无衬线字体栈，Geist 作为拉丁字符补充。
- 页面标题 28-36 px，面板标题 16-20 px，正文 15-17 px。
- 不按视口宽度连续缩放字体，不使用负字距。
- 距离、海拔、电量和时间使用表格数字特性，避免动态数值造成布局跳动。

### 动效

- 只使用 150-220 ms 的模式切换、折叠和状态反馈。
- 行中模式不使用大面积入场动画。
- 支持 `prefers-reduced-motion`，状态变化必须有文字和图标。

## 页面状态

### Loading

核心静态页面不应出现长时间 loading。仅外部数据或客户端偏好恢复时使用稳定尺寸 Skeleton，
并避免首屏因模式恢复大幅跳动。

### Empty

- 无临时笔记：说明笔记尚未创建，并给出目录规范。
- 无当日匹配：显示完整行程总览，不错误选中 D0。
- 无复核项：显示“当前没有到期复核”，不是空白卡片。

### Error

- 内容解析失败：构建失败，不发布残缺路书。
- localStorage 不可用：退化为不持久化，页面仍可阅读。
- 外部导航无法打开：保留可复制的地点和途经点文本。
- 来源过期：显示警告，不隐藏旧结论，方便人工复核。

## 数据安全与隐私

- 仓库只记录昵称或角色，不记录法定身份信息。
- 不收集分析数据、精确位置和健康数据。
- localStorage 只保存模式和清单布尔状态。
- 外链使用 `rel="noopener noreferrer"`。
- Markdown 不允许原始 HTML 和脚本。
- 未来如需分享订单信息，使用私有群聊或密码管理工具，不进入项目内容。

## 性能边界

- 首屏客户端 JavaScript 目标小于 150 KB gzip（不含 Next 基础运行时，实施时以构建报告为准）。
- 不为首期安装大型地图或图表库。
- 路书 HTML 在构建期生成，页面不在客户端重新解析 Markdown。
- 每日页面使用静态参数生成。
- 图片使用明确宽高、响应式尺寸和本地 WebP / AVIF。

## 兼容性

- 目标浏览器：当前和前一个主版本的 Chrome、Safari、Edge；iOS Safari 为关键移动端。
- 核心阅读在 JavaScript 失败时仍应通过服务端 HTML 可用。
- localStorage、PWA 和深链均为渐进增强。
- 中文地点名和 URL 查询参数统一用标准编码 API 生成。

## 验证策略

### 自动验证

- ESLint 和 Next production build。
- 数据 schema：日期、日序、来源引用、路线段和复核时间。
- 观景 schema：ID / 日程 / 路段引用、顺序、GeoRef、停车导航权限和 D5 复用关系。
- 行前快照：快照归属、决策 / 任务 ID、截止日期和行程窗口；首页里程、节点、风险与复核摘要从事实源派生。
- 内容单元测试：frontmatter、日期、H1 一致性、GFM 目录、重复标题锚点和原始 HTML 拒绝。
- 单元测试：当前日推导、过期状态、A/B 触发显示、清单版本合并。
- production build 验证 `/guidebook` 静态生成，不带页面级客户端 Markdown 包。

### 视觉验证

- 390 × 844、768 × 1024、1440 × 1000 三个视口。
- 检查行前 / 行中模式、长地点名、表格、离线提示、危险警告。
- 检查 `/scenic` 的筛选、路线带 / 列表同步、走廊线段、P2 无导航操作和地图失败退化。
- Safari 验证 sticky header、底部导航、滚动容器和 safe-area。
- 无文本溢出、卡片嵌套、控件位移和不连贯遮挡。

### 内容验收

- 10 个住宿夜与日期一致。
- 主线 A 每日只有一个主目标。
- 亚丁、补能和天气没有被写成静态保证。
- D3、D5、D9 保留明确的最晚时间和回撤逻辑。
- D1-D9 观景顺序与主线一致，D3 / D5 停车预算和 D-7 复核要求可见。
- 所有动态来源可看到最后复核时间。

## 发布与回滚

- 首期可部署到 Vercel 或其他 Next.js 平台，不在设计阶段绑定域名。
- 合并前使用 preview 环境由至少 2 名同行者在手机上验收。
- 内容与代码同版本发布，页面底部显示内容版本。
- 路线临时变更优先更新结构化数据和正式路书，再发布；紧急情况下使用群聊通知，不能等待站点发布。
- 回滚使用上一个可用部署版本；动态错误信息应通过更新复核状态修正，不静默删除来源。

## 风险与边界情况

| 风险                     | 影响                       | 设计应对                                     |
| ------------------------ | -------------------------- | -------------------------------------------- |
| 路线与 Markdown 重复     | 两处数据矛盾               | FE-01 迁移后以 `trip.ts` 为可计算事实源      |
| 国庆动态变化快           | 旧结论误导                 | freshness + verifiedAt + reviewAt + 过期警告 |
| 弱网 / 断网              | 路书打不开                 | 构建期内容 + OFFLINE 工作包                  |
| 一车 7 人                | 行李和舒适度风险           | 首页保留未决项，正式路书要求实车演练         |
| 用户把项目当实时导航     | 错过管制或补能变化         | 每日页固定导航免责声明和复核入口             |
| 把无名风景做成假图钉     | 驾驶员在不安全位置找停车点 | 走廊使用区间模型，P2 / 禁停无停车导航        |
| 国庆停车场满位或单向难进 | 急刹、倒车或跨实线         | 记录行驶方向与入口说明，满位直接通过         |
| 清单本地状态丢失         | 任务重复或漏做             | 状态非安全关键；页面始终显示原始清单         |
| 手机日期 / 时区错误      | 选错当天                   | 显示完整日期，允许手动切日                   |
| PWA 缓存旧内容           | 旧路线持续可见             | 显示内容版本、检测更新、提供刷新入口         |

## 明确排除

- 同行者实时定位和轨迹上报。
- 自动抓取 / 爬取景区、地图或蔚来实时数据。
- 未经人工确认自动改变 A/B 路线。
- 为无可靠停车结论的沿途机位生成“一键导航停车”，或鼓励驾驶员行驶中操作页面。
- 公共用户注册、UGC、评论和社交分享墙。
- 在线预算结算和支付。
- 将医疗或救援逻辑做成自动诊断系统。
