export type EmergencyContact = {
  id: string;
  label: string;
  number: string;
  description: string;
};

export type SafetyRule = {
  id: string;
  title: string;
  description: string;
};

export const chuanxiSafetyGuide = {
  altitudeDangerSignals: [
    "静息状态下仍呼吸困难",
    "意识异常、反应迟钝或无法正常交流",
    "走路不稳或明显失去协调",
    "持续呕吐、无法正常进食饮水",
    "明显胸闷，或症状在短时间内快速加重",
  ],
  altitudeActions: [
    "立即停止行程、徒步和继续上升",
    "不让不适者独处、驾驶或靠吸氧继续赶行程",
    "在安全可行的前提下尽快下降海拔",
    "拨打 120，或前往最近具备救治能力的医疗机构",
  ],
  drivingStopConditions: [
    {
      id: "driver-unfit",
      title: "驾驶员状态不适合继续",
      description: "困倦、头痛、恶心、视线异常、反应变慢或无法安全轮换。",
    },
    {
      id: "weather-road",
      title: "道路条件超出安全边界",
      description: "持续雨雪、明显结冰、低能见度、落石或官方临时管制。",
    },
    {
      id: "nightfall",
      title: "日照窗口已被挤压",
      description: "导航预计到店接近日落时，取消剩余观景和支线，不继续塞景点。",
    },
    {
      id: "vehicle-warning",
      title: "车辆出现关键告警",
      description: "轮胎、制动、电池或其他影响安全的告警未排除。",
    },
    {
      id: "unknown-detour",
      title: "只能依靠陌生便道绕行",
      description: "不走社交平台小路或非铺装捷径，优先回撤成熟城镇并重新规划。",
    },
  ] satisfies SafetyRule[],
  roadsideActions: [
    "先把人员和车辆移到不造成二次风险的位置；无法安全移动时开启警示并按现场规则处置",
    "根据事件类型联系 110、120、122 或 119，并准确说明道路、方向和附近明确地标",
    "使用车辆 App 或保险单内已核实的救援入口，不临时相信陌生号码",
    "由一人统一对外沟通，其余人保留电量、照看成员并服从现场人员指挥",
  ],
  contacts: [
    {
      id: "medical",
      label: "医疗急救",
      number: "120",
      description: "严重不适、意识异常、呼吸困难或其他紧急医疗情况",
    },
    {
      id: "police",
      label: "报警",
      number: "110",
      description: "人身安全、治安或需要公安协助的紧急情况",
    },
    {
      id: "traffic",
      label: "交通事故报警",
      number: "122",
      description: "道路交通事故和相关警情",
    },
    {
      id: "fire",
      label: "消防救援",
      number: "119",
      description: "火灾、被困及需要消防救援的紧急情况",
    },
  ] satisfies EmergencyContact[],
} as const;
