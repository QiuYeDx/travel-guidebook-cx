import type { Metadata } from "next";
import { BookOpenCheckIcon, MapPinnedIcon, SmartphoneIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "项目说明",
  description: `${siteConfig.name} 的范围、内容来源与开发阶段`,
};

const principles = [
  {
    icon: BookOpenCheckIcon,
    title: "单一事实源",
    description: "路线、风险、预约和补能先在版本化内容中确认，再由页面读取。",
  },
  {
    icon: SmartphoneIcon,
    title: "移动端优先",
    description: "前期适合共同讨论，旅行中能在弱网下快速找到当天重点。",
  },
  {
    icon: MapPinnedIcon,
    title: "导航不替代",
    description: "项目负责解释决策和上下文，实时导航仍交给车机与地图应用。",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-9 px-4 py-10 sm:px-6 sm:py-14">
      <section className="max-w-3xl space-y-4">
        <Badge variant="secondary">项目说明</Badge>
        <h1 className="text-3xl font-semibold">
          一份能讨论，也能在路上执行的路书
        </h1>
        <p className="leading-7 text-muted-foreground">
          本项目服务于约 6 至 7 名朋友的 2026 川西自驾。它不是景点营销页，
          重点是把每日路线、海拔适应、补能、预约、降级条件和团队分工放在同一处。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {principles.map((item) => (
          <Card key={item.title}>
            <CardHeader className="space-y-3">
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription className="leading-6">
                {item.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">当前边界</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
          <p>
            当前已建立完整攻略、行前总览、行程时间线、每日执行页、交互式观景路线、
            本地清单和安全页；行中模式、离线缓存和多人编辑仍不在现阶段能力内。
          </p>
          <p>
            票务、路况、天气和充换电状态都是动态信息，页面最终会展示复核时间，
            不把旧数据伪装成实时结论。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
