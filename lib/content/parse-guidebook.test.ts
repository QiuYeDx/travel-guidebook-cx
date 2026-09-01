import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { parseGuidebook } from "./parse-guidebook";

test("the primary guidebook parses with stable metadata and anchors", async () => {
  const raw = await readFile(
    path.join(
      process.cwd(),
      "content",
      "guidebook",
      "2026-chuanxi-grand-loop.md",
    ),
    "utf8",
  );
  const guidebook = parseGuidebook(raw, "2026-chuanxi-grand-loop");

  assert.equal(guidebook.title, "2026 川西大环线 7 天自驾路书");
  assert.equal(guidebook.version, "2.0");
  assert.equal(guidebook.lastUpdated, "2026-09-02");
  assert.ok(guidebook.tableOfContents.length > 30);
  assert.ok(
    guidebook.tableOfContents.some(
      (entry) => entry.id === "七天路线总表" && entry.depth === 2,
    ),
  );
  assert.ok(
    guidebook.tableOfContents.some(
      (entry) => entry.id === "观星总表",
    ),
  );
});

test("duplicate headings receive deterministic GitHub-style suffixes", () => {
  const guidebook = parseGuidebook(
    `---
title: 测试路书
description: 测试描述
version: "1.0"
lastUpdated: "2026-08-25"
---

# 测试路书

## 重复标题

## 重复标题
`,
    "test-guidebook",
  );

  assert.deepEqual(
    guidebook.tableOfContents.map((entry) => entry.id),
    ["重复标题", "重复标题-1"],
  );
});

test("raw HTML is rejected before rendering", () => {
  assert.throws(
    () =>
      parseGuidebook(
        `---
title: 测试路书
description: 测试描述
version: "1.0"
lastUpdated: "2026-08-25"
---

# 测试路书

<script>alert("unsafe")</script>
`,
        "unsafe-guidebook",
      ),
    /Raw HTML is not allowed/,
  );
});

test("frontmatter title must match the first H1", () => {
  assert.throws(
    () =>
      parseGuidebook(
        `---
title: Frontmatter 标题
description: 测试描述
version: "1.0"
lastUpdated: "2026-08-25"
---

# 正文标题
`,
        "mismatched-guidebook",
      ),
    /frontmatter title must match the first H1/,
  );
});

test("lastUpdated must be a real ISO calendar date", () => {
  assert.throws(
    () =>
      parseGuidebook(
        `---
title: 测试路书
description: 测试描述
version: "1.0"
lastUpdated: "2026-02-30"
---

# 测试路书
`,
        "invalid-date-guidebook",
      ),
    /lastUpdated must use YYYY-MM-DD format/,
  );
});
