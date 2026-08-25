"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  CheckCircle2Icon,
  CloudDownloadIcon,
  CloudOffIcon,
  RefreshCwIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getOfflineLinkAction } from "@/lib/offline/navigation-policy";

type OfflineStatus =
  "checking" | "ready" | "update-available" | "unsupported" | "error";

const LAST_SYNC_KEY_PREFIX = "chuanxi-roadbook-offline-synced-at:";

function subscribeToOnlineState(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getOnlineSnapshot() {
  return navigator.onLine;
}

function getServerOnlineSnapshot() {
  return true;
}

function getWorkerVersion(worker?: ServiceWorker | null): string | undefined {
  if (!worker) return undefined;
  return new URL(worker.scriptURL).searchParams.get("v") ?? undefined;
}

function readLastSync(contentVersion: string): string | undefined {
  try {
    return (
      localStorage.getItem(`${LAST_SYNC_KEY_PREFIX}${contentVersion}`) ??
      undefined
    );
  } catch {
    return undefined;
  }
}

function writeLastSync(contentVersion: string): string {
  const value = new Date().toISOString();
  try {
    localStorage.setItem(`${LAST_SYNC_KEY_PREFIX}${contentVersion}`, value);
  } catch {
    // The cache remains usable when private browsing blocks localStorage.
  }
  return value;
}

function formatSyncTime(value?: string): string {
  if (!value) return "本次会话";
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "本次会话";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function OfflineStatusBar({
  contentVersion,
}: {
  contentVersion: string;
}) {
  const isOnline = useSyncExternalStore(
    subscribeToOnlineState,
    getOnlineSnapshot,
    getServerOnlineSnapshot,
  );
  const [status, setStatus] = useState<OfflineStatus>("checking");
  const [lastSync, setLastSync] = useState<string>();
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker>();
  const refreshOnControllerChange = useRef(false);

  useEffect(() => {
    setLastSync(readLastSync(contentVersion));
    if (!("serviceWorker" in navigator)) {
      setStatus("unsupported");
      return;
    }

    let disposed = false;

    function markReady(cacheInstalled = false) {
      if (disposed) return;
      setWaitingWorker(undefined);
      const existingSync = readLastSync(contentVersion);
      setLastSync(
        cacheInstalled || !existingSync
          ? writeLastSync(contentVersion)
          : existingSync,
      );
      setStatus("ready");
    }

    function inspectRegistration(nextRegistration: ServiceWorkerRegistration) {
      const waiting = nextRegistration.waiting;
      if (waiting && getWorkerVersion(waiting) === contentVersion) {
        setWaitingWorker(waiting);
        setStatus("update-available");
        return;
      }

      const activeVersion = getWorkerVersion(nextRegistration.active);
      if (activeVersion === contentVersion && !nextRegistration.installing) {
        markReady();
      }
    }

    function handleControllerChange() {
      if (refreshOnControllerChange.current) window.location.reload();
    }

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      handleControllerChange,
    );

    navigator.serviceWorker
      .register(`/sw.js?v=${encodeURIComponent(contentVersion)}`, {
        scope: "/",
        updateViaCache: "none",
      })
      .then((nextRegistration) => {
        if (disposed) return;
        inspectRegistration(nextRegistration);
        nextRegistration.addEventListener("updatefound", () => {
          const installing = nextRegistration.installing;
          installing?.addEventListener("statechange", () => {
            if (installing.state !== "installed" || disposed) return;
            if (navigator.serviceWorker.controller) {
              setWaitingWorker(nextRegistration.waiting ?? installing);
              setStatus("update-available");
            } else {
              markReady(true);
            }
          });
        });
        return navigator.serviceWorker.ready;
      })
      .then((readyRegistration) => {
        if (disposed || !readyRegistration) return;
        inspectRegistration(readyRegistration);
      })
      .catch(() => {
        if (!disposed) setStatus("error");
      });

    function handleOfflineLink(event: MouseEvent) {
      if (navigator.onLine || event.defaultPrevented || event.button !== 0)
        return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const action = getOfflineLinkAction(anchor.href, window.location.href);
      if (action.kind === "allow") return;
      event.preventDefault();
      if (action.kind === "internal-document") {
        window.location.assign(action.url);
      } else {
        toast.error("当前离线，外部链接不可用；请使用页面中的复制信息");
      }
    }

    document.addEventListener("click", handleOfflineLink, true);
    return () => {
      disposed = true;
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange,
      );
      document.removeEventListener("click", handleOfflineLink, true);
    };
  }, [contentVersion]);

  function applyUpdate() {
    if (!waitingWorker) return;
    refreshOnControllerChange.current = true;
    waitingWorker.postMessage({ type: "SKIP_WAITING" });
  }

  const offlineReady = status === "ready" || status === "update-available";
  const meta =
    !isOnline && offlineReady
      ? {
          icon: CloudOffIcon,
          label: `离线阅读 · 已缓存路书 v${contentVersion}`,
          detail: `同步于 ${formatSyncTime(lastSync)}`,
          tone: "text-amber-900 dark:text-amber-100",
        }
      : !isOnline
        ? {
            icon: TriangleAlertIcon,
            label: `离线缓存未就绪 · 路书 v${contentVersion}`,
            detail: "恢复网络后刷新重试",
            tone: "text-amber-900 dark:text-amber-100",
          }
        : status === "update-available"
          ? {
              icon: RefreshCwIcon,
              label: `路书 v${contentVersion} 有更新可用`,
              detail: "刷新后使用新缓存",
              tone: "text-emerald-900 dark:text-emerald-100",
            }
          : status === "ready"
            ? {
                icon: CheckCircle2Icon,
                label: `离线路书 v${contentVersion} 已就绪`,
                detail: `同步于 ${formatSyncTime(lastSync)}`,
                tone: "text-muted-foreground",
              }
            : status === "checking"
              ? {
                  icon: CloudDownloadIcon,
                  label: `正在准备离线路书 v${contentVersion}`,
                  detail: "首次准备可能需要片刻",
                  tone: "text-muted-foreground",
                }
              : {
                  icon: TriangleAlertIcon,
                  label:
                    status === "unsupported"
                      ? `浏览器不支持离线缓存 · 路书 v${contentVersion}`
                      : `离线缓存准备失败 · 路书 v${contentVersion}`,
                  detail: "保持联网使用，稍后刷新重试",
                  tone: "text-amber-900 dark:text-amber-100",
                };
  const Icon = meta.icon;

  return (
    <div className="border-b bg-muted/30 text-xs" role="status">
      <div className="mx-auto flex min-h-9 max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 sm:px-6">
        <p className={`flex min-w-0 items-center gap-2 ${meta.tone}`}>
          <Icon className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="font-medium">{meta.label}</span>
          <span className="hidden text-muted-foreground sm:inline">
            · {meta.detail}
          </span>
        </p>
        {isOnline && status === "update-available" ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={applyUpdate}
          >
            <RefreshCwIcon aria-hidden="true" />
            刷新更新
          </Button>
        ) : null}
      </div>
    </div>
  );
}
