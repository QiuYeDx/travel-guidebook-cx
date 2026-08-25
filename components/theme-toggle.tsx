"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";

import { DualStateToggle } from "@/components/qiuye-ui/dual-state-toggle";

interface ThemeToggleProps {
  duration?: number;
}

export function ThemeToggle({ duration = 400 }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const isDark = resolvedTheme === "dark";

  const toggleTheme = React.useCallback(async () => {
    // 基于实际解析后的主题切换，避免 system + dark 时按钮状态滞后。
    const newTheme = isDark ? "light" : "dark";

    if (!buttonRef.current) {
      setTheme(newTheme);
      return;
    }

    // 检查是否支持 View Transition API
    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    // 获取按钮位置用于计算动画起点
    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    );

    // 启动 View Transition
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
      });
    });

    // 等待过渡准备就绪
    await transition.ready;

    // 应用圆形展开动画
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }, [isDark, setTheme, duration]);

  return (
    <DualStateToggle
      ref={buttonRef}
      active={isDark}
      onToggle={() => toggleTheme()}
      activeIcon={<MoonIcon />}
      inactiveIcon={<SunIcon />}
      activeLabel="切换到浅色主题"
      inactiveLabel="切换到深色主题"
      variant="ghost"
      effect="rotate"
      transitionDuration={0.35}
    />
  );
}
