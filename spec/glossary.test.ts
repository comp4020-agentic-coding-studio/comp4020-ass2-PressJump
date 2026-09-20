// The glossary names a week for every term, and the component turns that week
// into a lecture link. Nothing in the build checks that the week exists: an
// entry saying "week 14" would render with no link at all and look fine.
//
// This is the page most likely to rot, because it is the one that talks about
// the other twelve without being generated from them.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as {
  nodes: ApiNode[];
};
const html = readFileSync(resolve("dist/glossary/index.html"), "utf8");

const lectureWeeks = new Set(
  api.nodes.filter((node) => node.type === "lectures").map((node) => Number(node.meta?.week)),
);

const entries = [...html.matchAll(/<div class="entry"[^>]*id="([^"]+)"/g)].map((m) => m[1]);
const citedWeeks = [...html.matchAll(/Week (\d+),/g)].map((m) => Number(m[1]));

describe("the glossary", () => {
  it("has entries at all", () => {
    expect(entries.length).toBeGreaterThanOrEqual(15);
  });

  it("gives every term its own anchor", () => {
    expect(new Set(entries).size, "two terms share an id").toBe(entries.length);
  });

  it("dates every term to a week the course actually runs", () => {
    expect(citedWeeks.length, "a term cites no week").toBe(entries.length);
    for (const week of citedWeeks) {
      expect(lectureWeeks.has(week), `a term cites week ${week}, which has no lecture`).toBe(true);
    }
  });

  it("links every cited week to its lecture page", () => {
    const links = [...html.matchAll(/href="[^"]*\/lectures\/([a-z0-9-]+)\/"/g)].map((m) => m[1]);
    expect(links.length, "a term cites a week but renders no lecture link").toBe(entries.length);
  });
});
