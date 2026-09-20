// The home page is read for about ten minutes and most of it is never checked
// against anything. Two things on it are checkable and both are the kind of
// claim a reader does check.
//
// The first is the stat row. A home page saying twelve teaching weeks over a
// timetable with eleven is the cheapest possible way to look careless, and
// nothing in the build compares the two. The numbers are derived, so this
// exists for the day somebody types one in.
//
// The second is the Little's Law panel. Its answer is rendered server-side so
// the page reads as a worked example without a script; if that ever becomes
// client-only, the panel ships blank to a reader with no JavaScript and to
// every crawler.
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
const html = readFileSync(resolve("dist/index.html"), "utf8");

const byType = (type: string): ApiNode[] => api.nodes.filter((node) => node.type === type);
const lectures = byType("lectures");
const sessions = byType("sessions");
const assessments = byType("assessments");

// Astro appends a scoped-style attribute after the class, so the tag is
// `<span class="value" data-astro-cid-...>`, not `<span class="value">`.
const stats = [...html.matchAll(/<span class="value"[^>]*>(\d+)<\/span>/g)].map((m) =>
  Number(m[1]),
);

describe("the home page", () => {
  it("counts the same weeks the timetable runs", () => {
    const weeks = new Set([...lectures, ...sessions].map((node) => Number(node.meta?.week)));
    expect(stats[0], "the stat row disagrees with the number of teaching weeks").toBe(weeks.size);
  });

  it("counts the same contact hours the timetable implies", () => {
    // One hour a lecture, two a field session. The rates are the component's
    // props; what matters is that the total tracks the number of entries.
    expect(stats[1], "contact hours do not follow from the lectures and sessions").toBe(
      lectures.length * 1 + sessions.length * 2,
    );
  });

  it("counts the same assessment the assessment page lists", () => {
    expect(stats[2], "the stat row disagrees with the number of assessments").toBe(
      assessments.length,
    );
    const weight = assessments.reduce((sum, node) => sum + Number(node.meta?.weight ?? 0), 0);
    expect(html, `the stat row does not state the ${weight}% total`).toContain(`${weight}%`);
  });

  it("works out the first Little's Law answer at build time", () => {
    const panel = html.match(/<output[^>]*data-answer[^>]*>([\s\S]*?)<\/output>/);
    expect(panel, "no Little's Law output on the page").toBeTruthy();
    const answer = panel?.[1].replace(/<[^>]+>/g, "").trim() ?? "";
    expect(answer, "the answer ships empty, so a reader without a script sees nothing").not.toBe(
      "",
    );
    expect(answer, "the answer is not a duration").toMatch(/second|minute|min /);
  });

  it("credits every photograph it shows", () => {
    const figures = (html.match(/<figure class="photo"/g) ?? []).length;
    const credits = (html.match(/class="credit"/g) ?? []).length;
    expect(figures, "no photograph on the home page").toBeGreaterThan(0);
    expect(credits, "a photograph is uncredited").toBe(figures);
    for (const img of html.match(/<figure class="photo"[\s\S]*?<\/figure>/g) ?? []) {
      expect(img, "a photograph has no alt text").toMatch(/alt="[^"]+"/);
    }
  });
});
