export type ChecklistScope = "pretrip" | "daily-departure" | "daily-close";

export type ChecklistItem = {
  id: `v${number}-${string}`;
  label: string;
  note?: string;
  critical?: boolean;
};

export type ChecklistDefinition = {
  id: string;
  version: number;
  scope: ChecklistScope;
  title: string;
  description: string;
  items: ChecklistItem[];
};

export const chuanxiChecklistVersion = "1.0";

export const chuanxiChecklists = [
  {
    id: "pretrip-readiness",
    version: 1,
    scope: "pretrip",
    title: "行前准备",
    description: "出发前共同关闭。订单只记录负责人和状态，不保存证件号或密码。",
    items: [
      {
        id: "v1-headcount-and-arrival",
        label: "确认最终人数和 9 月 27 日成都到达时间",
      },
      {
        id: "v1-drivers-and-roles",
        label: "确定至少 2 名轮换驾驶员和团队分工",
        critical: true,
      },
      {
        id: "v1-refundable-lodging",
        label: "全程住宿已预订，并记录取消期限、停车与供暖结论",
      },
      {
        id: "v1-attraction-bookings",
        label: "亚丁、双桥沟等预约规则与结果已复核",
      },
      {
        id: "v1-es8-configuration",
        label: "确认 ES8 代际、电池、轮胎、保险和救援范围",
        critical: true,
      },
      {
        id: "v1-full-load-rehearsal",
        label: "完成 6 至 7 人实车满载与行李固定演练",
        note: "座位、安全带、后窗视野或行李固定不合格时调整车辆方案。",
        critical: true,
      },
      {
        id: "v1-tire-chain-practice",
        label: "防滑链规格匹配，并已练习安装",
      },
      {
        id: "v1-energy-main-and-backup",
        label: "每个长途段已保存补能主站、备站与可过夜区域",
        critical: true,
      },
      {
        id: "v1-personal-layers",
        label: "个人防风防水、保暖、速干层与防滑鞋已备齐",
      },
      {
        id: "v1-documents-and-medicine",
        label: "证件、少量现金、常用药和医生建议已由本人准备",
      },
      {
        id: "v1-public-safety-kit",
        label: "急救包、反光背心、照明、警示用品和基础补给已装车",
      },
      {
        id: "v1-offline-information",
        label: "离线地图、住宿地址、保险和道路救援入口已分散保存",
        critical: true,
      },
      {
        id: "v1-d7-official-review",
        label: "D-7 已核对官方道路、景区公告与 7 至 10 天天气",
      },
      {
        id: "v1-d3-live-review",
        label: "D-3 已复核逐日天气、管制、补能与成员状态",
        critical: true,
      },
    ],
  },
  {
    id: "daily-departure",
    version: 1,
    scope: "daily-departure",
    title: "每日出发前",
    description: "上车前由主驾、车辆负责人和行程负责人共同确认。",
    items: [
      {
        id: "v1-all-present-and-secured",
        label: "全员到齐，安全带可用，行李固定",
        critical: true,
      },
      {
        id: "v1-official-road-status",
        label: "当天道路和景区没有新的官方管制",
        critical: true,
      },
      {
        id: "v1-weather-sunset-arrival",
        label: "天气、日落和最晚到店时间已确认",
      },
      {
        id: "v1-energy-plan",
        label: "当前电量、主补能、备站和目标到达电量已确认",
        critical: true,
      },
      {
        id: "v1-driver-and-rotation",
        label: "主驾状态正常，轮换顺序明确",
        critical: true,
      },
      {
        id: "v1-lodging-offline",
        label: "酒店地址、电话和停车方式可离线查看",
      },
      {
        id: "v1-water-layers-documents",
        label: "水、保暖层、证件、药品和充电宝已上车",
      },
      {
        id: "v1-fallback-briefing",
        label: "当天 A/B 切换条件已向全员说明",
      },
    ],
  },
  {
    id: "daily-close",
    version: 1,
    scope: "daily-close",
    title: "每日收车",
    description: "到店后完成车辆、人员和次日方案的闭环。",
    items: [
      {
        id: "v1-vehicle-parked-and-energy",
        label: "车辆停妥，并完成补能安排",
        critical: true,
      },
      {
        id: "v1-health-check",
        label: "全员身体状态已口头确认",
        critical: true,
      },
      {
        id: "v1-next-day-review",
        label: "次日道路、天气、预约和住宿已复核",
      },
      {
        id: "v1-equipment-count",
        label: "相机、无人机、证件和充电设备已清点",
      },
      {
        id: "v1-expenses-recorded",
        label: "公共支出已记录",
      },
      {
        id: "v1-evening-briefing",
        label: "20:30 小会已确定次日方案、出发时间和首位驾驶员",
        critical: true,
      },
    ],
  },
] satisfies ChecklistDefinition[];
