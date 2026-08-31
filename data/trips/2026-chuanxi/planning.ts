import { assertValidPlanningSnapshot } from "../../../lib/trip/planning";
import type { PlanningSnapshot } from "../../../lib/trip/types";
import { chuanxiTrip } from "./trip";

const planningSnapshot = {
  tripId: "2026-chuanxi-grand-loop",
  updatedAt: "2026-08-31",
  decisions: [
    {
      id: "DECISION-HEADCOUNT",
      title: "同行人数",
      recommendation: "固定 3 人同行",
      impact: "座位和行李空间充足，可形成驾驶员、领航员、休息位三角色",
      status: "confirmed",
      deadline: { date: "2026-08-31", label: "已确认" },
    },
    {
      id: "DECISION-DATES",
      title: "出发与返程",
      recommendation: "9 月 27 日上午深圳出发，10 月 6 日回到深圳",
      impact: "决定只走短环线并排除色达—措卡湖远端支线",
      status: "confirmed",
      deadline: { date: "2026-08-31", label: "已确认" },
    },
    {
      id: "DECISION-VEHICLE",
      title: "EC6 参数与车况",
      recommendation: "确认代际、电池容量、轮胎、保险、车主权限与异地救援",
      impact: "未关闭前不做固定站点和精确电量表",
      status: "open",
      deadline: { date: "2026-09-10", label: "出发前 17 天" },
    },
    {
      id: "DECISION-DRIVERS",
      title: "三人驾驶轮换",
      recommendation: "高速每 90 至 120 分钟轮换；山路只在正式停车区域换人",
      impact: "长途日仍需睡眠和停靠，不能把三人轮换等同于通宵能力",
      status: "confirmed",
      deadline: { date: "2026-08-31", label: "已确认" },
    },
    {
      id: "DECISION-ROOMS",
      title: "房间数与床型",
      recommendation: "默认两间房，优先一间双床 + 一间单 / 大床，可停车且可取消",
      impact: "国庆期间临时改房成本高",
      status: "open",
      deadline: { date: "2026-09-05", label: "尽快锁定" },
    },
  ],
  tasks: [
    {
      id: "TASK-LODGING",
      title: "9 晚住宿",
      note: "贵阳、都江堰、古尔沟、黑水两晚、金川、新都桥、雅安、贵阳；逐晚记录取消期限",
      status: "open",
      deadline: { date: "2026-09-05", label: "尽快锁定" },
    },
    {
      id: "TASK-BIPENGGOU",
      title: "毕棚沟预约与景交复核",
      note: "核对 9 月 29 日开放、预约、入园时段、停车和景交末班",
      status: "open",
      deadline: { date: "2026-09-20", label: "D-7 复核" },
    },
    {
      id: "TASK-DAGU",
      title: "达古冰川预约与索道复核",
      note: "核对 10 月 1 日开放、索道检修、天气、停车和官方票务",
      status: "open",
      deadline: { date: "2026-09-24", label: "D-7 复核" },
    },
    {
      id: "TASK-ROADS",
      title: "跨县道路双地图复核",
      note: "重点核对古尔沟—黑水、黑水—金川、金川—丹巴—八美和折多山",
      status: "open",
      deadline: { date: "2026-09-24", label: "D-3 起滚动复核" },
    },
    {
      id: "TASK-POWER",
      title: "EC6 补能收藏与备选",
      note: "用蔚来车机 / App 按每天主线收藏 A/B 补能点，出发前夜重新核对可用性",
      status: "open",
      deadline: { date: "2026-09-24", label: "D-3 复核" },
    },
  ],
} satisfies PlanningSnapshot;

export const chuanxiPlanningSnapshot = assertValidPlanningSnapshot(
  planningSnapshot,
  chuanxiTrip,
);
