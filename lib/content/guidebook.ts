import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

import { parseGuidebook } from "./parse-guidebook";

const guidebookFiles = {
  "2026-chuanxi-grand-loop": "2026-chuanxi-grand-loop.md",
} as const;

export type GuidebookSlug = keyof typeof guidebookFiles;

export const primaryGuidebookSlug: GuidebookSlug = "2026-chuanxi-grand-loop";

export const getGuidebook = cache(async (slug: string) => {
  if (!(slug in guidebookFiles)) return null;

  const fileName = guidebookFiles[slug as GuidebookSlug];
  const filePath = path.join(process.cwd(), "content", "guidebook", fileName);
  const raw = await readFile(filePath, "utf8");
  return parseGuidebook(raw, slug);
});

export function getPrimaryGuidebook() {
  return getGuidebook(primaryGuidebookSlug);
}
