import assert from "node:assert/strict";
import test from "node:test";

import type { SourceRef } from "../../lib/trip/types";
import {
  getActionableSourceReviews,
  getSourceVerificationStatus,
} from "./source-model";

function source(overrides: Partial<SourceRef> = {}): SourceRef {
  return {
    id: "SRC-TEST",
    title: "Test source",
    url: "https://example.com",
    publisher: "Test publisher",
    freshness: "seasonal",
    verifiedAt: "2026-08-25",
    reviewAt: "2026-09-20",
    ...overrides,
  };
}

test("stable sources without a review date remain verified", () => {
  assert.equal(
    getSourceVerificationStatus(
      source({ freshness: "stable", reviewAt: undefined }),
      "2027-08-25",
    ).status,
    "verified",
  );
});

test("seasonal sources enter the review window and then expire", () => {
  assert.equal(
    getSourceVerificationStatus(source(), "2026-09-12").status,
    "verified",
  );
  assert.deepEqual(getSourceVerificationStatus(source(), "2026-09-13"), {
    source: source(),
    status: "needs-review",
    daysUntilReview: 7,
  });
  assert.equal(
    getSourceVerificationStatus(source(), "2026-09-20").status,
    "needs-review",
  );
  assert.equal(
    getSourceVerificationStatus(source(), "2026-09-21").status,
    "expired",
  );
});

test("live sources require another review after their verified date", () => {
  const live = source({ freshness: "live", reviewAt: "2026-08-27" });
  assert.equal(
    getSourceVerificationStatus(live, "2026-08-25").status,
    "verified",
  );
  assert.equal(
    getSourceVerificationStatus(live, "2026-08-26").status,
    "needs-review",
  );
  assert.equal(
    getSourceVerificationStatus(live, "2026-08-28").status,
    "expired",
  );
});

test("actionable reviews exclude verified sources and put expired first", () => {
  const sources = [
    source({ id: "verified", reviewAt: "2026-10-01" }),
    source({ id: "due", reviewAt: "2026-09-20" }),
    source({ id: "expired", reviewAt: "2026-09-10" }),
  ];

  assert.deepEqual(
    getActionableSourceReviews(sources, "2026-09-18").map((item) => [
      item.source.id,
      item.status,
    ]),
    [
      ["expired", "expired"],
      ["due", "needs-review"],
    ],
  );
});
