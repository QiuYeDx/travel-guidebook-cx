import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import { toString } from "mdast-util-to-string";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";

import type { GuidebookDocument, TableOfContentsEntry } from "./types";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function readRequiredString(
  data: Record<string, unknown>,
  key: "title" | "description" | "version" | "lastUpdated",
): string {
  const value = data[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Guidebook frontmatter requires a non-empty ${key}`);
  }
  return value.trim();
}

function isIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsed.valueOf()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

export function parseGuidebook(raw: string, slug: string): GuidebookDocument {
  const parsedMatter = matter(raw);
  const title = readRequiredString(parsedMatter.data, "title");
  const description = readRequiredString(parsedMatter.data, "description");
  const version = readRequiredString(parsedMatter.data, "version");
  const lastUpdated = readRequiredString(parsedMatter.data, "lastUpdated");

  if (!isIsoDate(lastUpdated)) {
    throw new Error("Guidebook lastUpdated must use YYYY-MM-DD format");
  }

  const tree = remark().use(remarkGfm).parse(parsedMatter.content);
  const slugger = new GithubSlugger();
  const tableOfContents: TableOfContentsEntry[] = [];
  let firstHeading: string | undefined;
  let containsRawHtml = false;

  visit(tree, (node) => {
    if (node.type === "html") {
      containsRawHtml = true;
      return;
    }
    if (node.type !== "heading") return;

    const headingTitle = toString(node).trim();
    const id = slugger.slug(headingTitle);
    if (node.depth === 1 && firstHeading === undefined) {
      firstHeading = headingTitle;
    }
    if (node.depth === 2 || node.depth === 3) {
      tableOfContents.push({ id, title: headingTitle, depth: node.depth });
    }
  });

  if (containsRawHtml) {
    throw new Error("Raw HTML is not allowed in guidebook Markdown");
  }
  if (firstHeading !== title) {
    throw new Error("Guidebook frontmatter title must match the first H1");
  }

  return {
    slug,
    title,
    description,
    version,
    lastUpdated,
    content: parsedMatter.content,
    tableOfContents,
  };
}
