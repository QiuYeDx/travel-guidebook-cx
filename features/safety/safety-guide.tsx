import Link from "next/link";
import {
  AlertOctagonIcon,
  ArrowDownIcon,
  CarFrontIcon,
  CircleStopIcon,
  HeartPulseIcon,
  PhoneCallIcon,
  ShieldAlertIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { chuanxiSafetyGuide } from "@/data/trips/2026-chuanxi/safety";

export function SafetyGuide({ guide }: { guide: typeof chuanxiSafetyGuide }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="max-w-3xl border-b pb-7">
        <p className="flex items-center gap-2 text-xs font-medium text-red-700 dark:text-red-400">
          <ShieldAlertIcon className="size-4" aria-hidden="true" />
          风险识别与停止动作
        </p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
          安全与紧急联系
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          本页只提供一般风险识别，不进行医疗诊断。出现危险信号时优先停止、下降和求助，不用既定行程替代专业判断。
        </p>
      </header>

      <section
        aria-labelledby="altitude-emergency-title"
        className="mt-7 border-2 border-red-300 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/25 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <AlertOctagonIcon
            className="mt-0.5 size-6 shrink-0 text-red-700 dark:text-red-400"
            aria-hidden="true"
          />
          <div>
            <p className="text-xs font-semibold text-red-700 dark:text-red-400">
              立即停止继续上升
            </p>
            <h2
              id="altitude-emergency-title"
              className="mt-1 text-xl font-semibold"
            >
              高海拔危险信号
            </h2>
          </div>
        </div>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {guide.altitudeDangerSignals.map((signal) => (
            <li
              key={signal}
              className="flex items-start gap-2 text-sm leading-6"
            >
              <CircleStopIcon
                className="mt-1 size-4 shrink-0 text-red-700 dark:text-red-400"
                aria-hidden="true"
              />
              {signal}
            </li>
          ))}
        </ul>
        <div className="mt-6 border-t border-red-200 pt-5 dark:border-red-900">
          <h3 className="text-sm font-semibold">发现任一危险信号后的动作</h3>
          <ol className="mt-3 grid gap-3">
            {guide.altitudeActions.map((action, index) => (
              <li
                key={action}
                className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2 text-sm leading-6"
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-red-700 text-xs font-semibold text-white dark:bg-red-500 dark:text-red-950">
                  {index + 1}
                </span>
                {action}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="contacts-title" className="mt-9">
        <div className="flex items-end justify-between gap-4 border-b pb-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <PhoneCallIcon className="size-4" aria-hidden="true" />
              中国大陆紧急号码
            </p>
            <h2 id="contacts-title" className="mt-1 text-xl font-semibold">
              紧急联系
            </h2>
          </div>
          <p className="hidden text-xs text-muted-foreground sm:block">
            点击后由设备确认拨号
          </p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {guide.contacts.map((contact) => (
            <div
              key={contact.id}
                  className="grid gap-4 rounded-xl border p-4 sm:p-5"
            >
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold">{contact.label}</h3>
                  <span className="font-mono text-xl font-semibold tabular-nums">
                    {contact.number}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {contact.description}
                </p>
              </div>
              <Button asChild variant="outline" className="w-full">
                <a
                  href={`tel:${contact.number}`}
                  aria-label={`拨打${contact.label} ${contact.number}`}
                >
                  <PhoneCallIcon aria-hidden="true" />
                  拨打 {contact.number}
                </a>
              </Button>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs leading-5 text-muted-foreground sm:hidden">
          电话链接会交给当前设备处理，拨出前仍需按设备提示确认。
        </p>
      </section>

      <section aria-labelledby="driving-stop-title" className="mt-9">
        <div className="border-b pb-4">
          <p className="flex items-center gap-2 text-xs font-medium text-amber-700 dark:text-amber-400">
            <CarFrontIcon className="size-4" aria-hidden="true" />
            任一条件成立即停止冒进
          </p>
          <h2 id="driving-stop-title" className="mt-1 text-xl font-semibold">
            驾驶停止条件
          </h2>
        </div>
        <ol className="divide-y">
          {guide.drivingStopConditions.map((condition, index) => (
            <li
              key={condition.id}
              className="grid gap-2 py-5 sm:grid-cols-[2.5rem_13rem_minmax(0,1fr)] sm:items-start"
            >
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-sm font-semibold">{condition.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                {condition.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="roadside-title"
        className="mt-9 bg-[#17231d] px-5 py-6 text-white dark:bg-[#101914] sm:px-7"
      >
        <div className="flex items-start gap-3">
          <HeartPulseIcon
            className="mt-0.5 size-5 shrink-0 text-emerald-300"
            aria-hidden="true"
          />
          <div>
            <p className="text-xs font-medium text-emerald-200">
              事故、故障或被困时
            </p>
            <h2 id="roadside-title" className="mt-1 text-xl font-semibold">
              现场行动顺序
            </h2>
          </div>
        </div>
        <ol className="mt-5 grid gap-4">
          {guide.roadsideActions.map((action, index) => (
            <li
              key={action}
              className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 text-sm leading-6 text-white/80"
            >
              <span className="flex size-7 items-center justify-center border border-emerald-300/40 font-mono text-xs text-emerald-200">
                {index + 1}
              </span>
              {action}
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-8 flex flex-wrap items-center gap-3 border-t pt-5">
        <ArrowDownIcon
          className="size-4 text-muted-foreground"
          aria-hidden="true"
        />
        <p className="text-sm text-muted-foreground">
          轻度不适、每日观察和完整驾驶纪律见正式攻略。
        </p>
        <Button asChild variant="link" className="h-auto px-0">
          <Link href="/guidebook#高海拔健康规则">查看完整规则</Link>
        </Button>
      </div>
    </div>
  );
}
