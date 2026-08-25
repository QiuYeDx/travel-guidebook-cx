import { assertValidPlanningSnapshot } from "../../../lib/trip/planning";
import type { PlanningSnapshot } from "../../../lib/trip/types";
import { chuanxiTrip } from "./trip";

const planningSnapshot = {
  tripId: "2026-chuanxi-grand-loop",
  updatedAt: "2026-08-25",
  decisions: [
    {
      id: "DECISION-HEADCOUNT",
      title: "最终人数与用车",
      recommendation: "6 人一辆 ES8；7 人优先两车或更换车辆方案",
      impact: "决定座位、行李、驾驶轮换和整体预算",
      status: "open",
      deadline: { date: "2026-08-27", label: "立即确认" },
    },
    {
      id: "DECISION-ASSEMBLY",
      title: "9 月 27 日成都集结",
      recommendation: "全员当晚入住成都，28 日早晨统一出发",
      impact: "未到齐时不能原样执行主线 A",
      status: "open",
      deadline: { date: "2026-08-27", label: "立即确认" },
    },
    {
      id: "DECISION-VEHICLE",
      title: "ES8 参数与装载",
      recommendation: "确认代际、电池、轮胎、保险并完成满载演练",
      impact: "未验证前无法关闭补能和行李方案",
      status: "open",
      deadline: { date: "2026-08-31", label: "8 月底前" },
    },
    {
      id: "DECISION-DRIVERS",
      title: "驾驶轮换",
      recommendation: "至少 2 名，最好 3 名熟练驾驶员",
      impact: "只有一名驾驶员时长途山路风险不可接受",
      status: "open",
      deadline: { date: "2026-08-31", label: "8 月底前" },
    },
    {
      id: "DECISION-YADING",
      title: "亚丁轻量游原则",
      recommendation: "只走短线，并接受预约、天气或身体不满足时取消",
      impact: "避免全队被单一景区和高海拔徒步绑架",
      status: "open",
      deadline: { date: "2026-09-05", label: "订房前" },
    },
    {
      id: "DECISION-ROOMS",
      title: "房间数与预算",
      recommendation: "6 人 3 间双床；7 人优先 4 间",
      impact: "黄金周临时加房成本高且选择少",
      status: "open",
      deadline: { date: "2026-09-05", label: "订房前" },
    },
  ],
  tasks: [
    {
      id: "TASK-TRANSPORT",
      title: "成都往返大交通",
      note: "按 9 月 27 日到齐、10 月 6 日返蓉的窗口锁定可退改方案",
      status: "open",
      deadline: { date: "2026-08-31", label: "8 月底前" },
    },
    {
      id: "TASK-LODGING",
      title: "全程 10 晚住宿",
      note: "优先可取消、可停车、有供暖，并逐晚记录取消期限",
      status: "open",
      deadline: { date: "2026-08-31", label: "8 月底前" },
    },
    {
      id: "TASK-VEHICLE",
      title: "车辆、保险与救援",
      note: "确认车辆来源、保险范围、轮胎状态和有效救援入口",
      status: "open",
      deadline: { date: "2026-08-31", label: "8 月底前" },
    },
    {
      id: "TASK-YADING",
      title: "稻城亚丁预约复核",
      note: "核对官方预约、开放范围和轻量游可执行性",
      status: "open",
      deadline: { date: "2026-09-20", label: "D-7 复核" },
    },
    {
      id: "TASK-SIGUNIANG",
      title: "双桥沟预约复核",
      note: "核对官方放票、景交站点和当日开放安排",
      status: "open",
      deadline: { date: "2026-09-20", label: "D-7 复核" },
    },
  ],
} satisfies PlanningSnapshot;

export const chuanxiPlanningSnapshot = assertValidPlanningSnapshot(
  planningSnapshot,
  chuanxiTrip,
);
