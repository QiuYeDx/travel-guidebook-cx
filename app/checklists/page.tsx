import type { Metadata } from "next";

import {
  chuanxiChecklists,
  chuanxiChecklistVersion,
} from "@/data/trips/2026-chuanxi/checklists";
import { chuanxiTrip } from "@/data/trips/2026-chuanxi/trip";
import { ChecklistWorkspace } from "@/features/checklist/checklist-workspace";

export const metadata: Metadata = {
  title: "准备与每日清单",
  description: "川西大环线行前、每日出发和收车清单",
};

export default function ChecklistsPage() {
  return (
    <ChecklistWorkspace
      trip={chuanxiTrip}
      definitions={chuanxiChecklists}
      contentVersion={chuanxiChecklistVersion}
    />
  );
}
