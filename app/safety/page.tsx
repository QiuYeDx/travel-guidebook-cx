import type { Metadata } from "next";

import { chuanxiSafetyGuide } from "@/data/trips/2026-chuanxi/safety";
import { SafetyGuide } from "@/features/safety/safety-guide";

export const metadata: Metadata = {
  title: "安全与紧急联系",
  description: "川西高海拔危险信号、驾驶停止条件和紧急联系",
};

export default function SafetyPage() {
  return <SafetyGuide guide={chuanxiSafetyGuide} />;
}
