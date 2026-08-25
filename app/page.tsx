import Link from "next/link";
import {
  CalendarDaysIcon,
  CarFrontIcon,
  FileTextIcon,
  MountainSnowIcon,
  RouteIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";

const routeFacts = [
  {
    icon: CalendarDaysIcon,
    label: "时间",
    value: "9 月 27 日集结 · 10 月 6 日返蓉",
  },
  {
    icon: RouteIcon,
    label: "路线",
    value: "成都 · 亚丁 · 丹巴 · 四姑娘山",
  },
  {
    icon: CarFrontIcon,
    label: "车辆",
    value: "蔚来 ES8 · 6 人理想，7 人待确认",
  },
  {
    icon: ShieldCheckIcon,
    label: "原则",
    value: "低体力 · 不夜驾 · 高反可随时降级",
  },
] as const;

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
      <section className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">2026 中秋国庆</Badge>
          <Badge variant="outline">路线讨论基线 v0.1</Badge>
        </div>

        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3">
            <MountainSnowIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-semibold sm:text-4xl">
              {siteConfig.name}
            </h1>
          </div>
          <p className="text-base leading-7 text-muted-foreground sm:text-lg">
            {siteConfig.description} 当前阶段先关闭人数、车辆、亚丁预约和住宿等关键决策，
            再进入前端可视化实现。
          </p>
        </div>

        <Button asChild>
          <Link href="/about">
            <FileTextIcon />
            查看项目说明
          </Link>
        </Button>
      </section>

      <Separator />

      <section className="grid gap-4 sm:grid-cols-2">
        {routeFacts.map((fact) => (
          <Card key={fact.label}>
            <CardHeader className="space-y-3">
              <fact.icon className="h-5 w-5 text-muted-foreground" />
              <CardDescription>{fact.label}</CardDescription>
              <CardTitle className="text-base leading-6">{fact.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">当前工作状态</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            内容先行，界面随后。Markdown 是当前讨论与复核的依据。
          </p>
        </div>
        <Card>
          <CardContent className="grid gap-3 pt-6 text-sm leading-6">
            <p>
              <strong>已完成：</strong>项目初始化、完整版攻略初稿、开发设计与执行计划。
            </p>
            <p>
              <strong>下一步：</strong>结构化行程数据、每日路书页、清单与行中模式。
            </p>
            <p>
              <strong>出发前：</strong>按路书中的 D-7 / D-3 / 每日复核清单更新动态信息。
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
