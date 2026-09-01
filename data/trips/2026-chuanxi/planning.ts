import { assertValidPlanningSnapshot } from "../../../lib/trip/planning";
import type { PlanningSnapshot } from "../../../lib/trip/types";
import { chuanxiTrip } from "./trip";

const planningSnapshot = {
  tripId: "2026-chuanxi-grand-loop",
  updatedAt: "2026-09-02",
  decisions: [
    {
      id: "DECISION-DATES",
      title: "7 天窗口",
      recommendation: "9 月 29 日从成都出发，10 月 5 日回到成都",
      impact: "到成都前后的集结交通必须单独安排，不能占用 D1—D7",
      status: "confirmed",
      deadline: { date: "2026-09-02", label: "已确认" },
    },
    {
      id: "DECISION-ROUTE",
      title: "北进东出唯一主线",
      recommendation: "四姑娘山—丹巴—塔公—亚丁—鱼子西—成都",
      impact: "D3 是唯一重负荷日，旧深圳 10 天短环线整体退役",
      status: "confirmed",
      deadline: { date: "2026-09-02", label: "已确认" },
    },
    {
      id: "DECISION-STARGAZING",
      title: "观星放在返程 D6",
      recommendation: "D2 早睡，D6 在鱼子西执行主观星夜",
      impact: "避免观星后直接叠加 D3 的 430 km 高原山路",
      status: "confirmed",
      deadline: { date: "2026-09-02", label: "已确认" },
    },
    {
      id: "DECISION-VEHICLE",
      title: "车辆与成都集结",
      recommendation: "确认实际车辆、到成都方式、轮胎、防滑链、保险与异地救援",
      impact: "未关闭前不输出固定补给点、末段乡道路况或精确续航表",
      status: "open",
      deadline: { date: "2026-09-15", label: "D-14 前" },
    },
    {
      id: "DECISION-ROOMS",
      title: "房间与晚到入住",
      recommendation: "优先可退改、可停车、供暖稳定的房型，D6 酒店必须接受晚到",
      impact: "国庆房态紧张，住宿不闭环会直接影响观星与次日返程",
      status: "open",
      deadline: { date: "2026-09-10", label: "尽快锁定" },
    },
  ],
  tasks: [
    {
      id: "TASK-LODGING",
      title: "6 晚低海拔住宿",
      note: "中路 1 晚、新都桥 2 晚、香格里拉镇 2 晚、雅江 1 晚；逐晚记录停车、供暖、最晚入住与取消期限",
      status: "open",
      deadline: { date: "2026-09-10", label: "尽快锁定" },
    },
    {
      id: "TASK-YADING",
      title: "稻城亚丁预约与短线复核",
      note: "核对 10 月 2 日实名预约、入园时段、开放线路、景区交通和短线下撤时间",
      status: "open",
      deadline: { date: "2026-09-22", label: "D-7 复核" },
    },
    {
      id: "TASK-ROADS",
      title: "高原道路与国庆管制复核",
      note: "重点核对四姑娘山—丹巴、新都桥—理塘—海子山、G318 返程、折多山与防滑链需求",
      status: "open",
      deadline: { date: "2026-09-26", label: "D-3 起滚动复核" },
    },
    {
      id: "TASK-YUZIXI",
      title: "鱼子西通行与夜间下撤",
      note: "核对预约渠道、通行、收费、停车、末段路况、结冰与最晚下撤；任何一项不清楚就取消",
      status: "open",
      deadline: { date: "2026-10-01", label: "D6 前 3 天" },
    },
    {
      id: "TASK-ASTRO",
      title: "10 月 4 日观星窗口",
      note: "按鱼子西位置重算月出、银河方位，并核对云量、风力、体感温度和相机低温准备",
      status: "open",
      deadline: { date: "2026-10-01", label: "D6 前 3 天" },
    },
  ],
} satisfies PlanningSnapshot;

export const chuanxiPlanningSnapshot = assertValidPlanningSnapshot(
  planningSnapshot,
  chuanxiTrip,
);
