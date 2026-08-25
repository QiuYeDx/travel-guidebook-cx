"use client";

import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function copyWithTextarea(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
}

async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  if (!copyWithTextarea(text)) {
    throw new Error("Clipboard API unavailable");
  }
}

export function CopyAction({
  text,
  label,
  className,
}: {
  text: string;
  label: string;
  className?: string;
}) {
  async function handleCopy() {
    try {
      await copyText(text);
      toast.success("已复制，可粘贴到车机或同行群");
    } catch {
      toast.error("复制失败，请长按页面中的地点信息手动复制");
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn(className)}
      onClick={handleCopy}
    >
      <CopyIcon aria-hidden="true" />
      {label}
    </Button>
  );
}
