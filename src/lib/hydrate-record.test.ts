import assert from "node:assert/strict";
import { test } from "node:test";

import { shouldHydrateLoadedRecord } from "./hydrate-record.ts";

test("hydrates when a record arrives for the first time", () => {
  assert.equal(shouldHydrateLoadedRecord("post-1", null), true);
});

test("does not hydrate again for the same record", () => {
  assert.equal(shouldHydrateLoadedRecord("post-1", "post-1"), false);
});

test("hydrates again when the record id changes", () => {
  assert.equal(shouldHydrateLoadedRecord("post-2", "post-1"), true);
});

test("does not hydrate without a record id", () => {
  assert.equal(shouldHydrateLoadedRecord(undefined, null), false);
});
