// The forum is the one collection deliberately kept out of the course API: it
// is part of running the course, not part of the record the programs and
// courses page ingests. That decision costs it every check the API gets, so
// the things `spec/data-integrity.test.ts` does for the other collections have
// to be done here instead.
//
// Three promises. A locked thread cannot be replied to. A staff badge says
// what the people page says. And nothing on the forum is dated outside the
// semester it belongs to.
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  title: string;
  meta?: Record<string, unknown>;
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as {
  course: { startDate: string; endDate: string };
  nodes: ApiNode[];
};

const forumDir = resolve("dist/forum");
const slugs = readdirSync(forumDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const pageFor = (slug: string): string =>
  readFileSync(resolve(forumDir, slug, "index.html"), "utf8");

const index = readFileSync(resolve(forumDir, "index.html"), "utf8");

const people = api.nodes.filter((node) => node.type === "people");
/** Role as the people page states it, by display name. */
const roleByName = new Map(people.map((person) => [person.title, String(person.meta?.role ?? "")]));

describe("the forum", () => {
  it("has threads at all, and an index listing them", () => {
    expect(slugs.length).toBeGreaterThanOrEqual(5);
    for (const slug of slugs) {
      expect(index, `${slug} is not linked from the forum index`).toContain(`/forum/${slug}/`);
    }
  });

  it("gives a locked thread no way to reply to it", () => {
    // Counted, so a test that stops finding locked threads fails rather than
    // passing vacuously.
    let lockedSeen = 0;
    for (const slug of slugs) {
      const html = pageFor(slug);
      // `[^>]*` for the scoped-style attribute Astro appends after the class.
      // Without it this matched nothing, `locked` was false on every thread,
      // and the whole check passed by never running. Found by planting the
      // regression it was supposed to catch and watching it stay green.
      const locked = /<span class="tag"[^>]*>Locked<\/span>/.test(html);
      const hasForm = /<form\b/.test(html);
      if (locked) {
        lockedSeen++;
        expect(hasForm, `${slug} is locked and still ships a reply form`).toBe(false);
        expect(html, `${slug} is locked and never says so in words`).toMatch(
          /This thread is locked/,
        );
      }
    }
    expect(lockedSeen, "no locked thread found, so this test checked nothing").toBeGreaterThan(0);
  });

  it("never posts a form anywhere this site does not serve", () => {
    for (const slug of slugs) {
      for (const form of pageFor(slug).match(/<form\b[^>]*>/g) ?? []) {
        expect(form, `${slug}: an action posts a reader into a 404`).not.toMatch(/\saction=/);
        expect(form, `${slug}: a method posts a reader into a 404`).not.toMatch(/\smethod=/);
      }
    }
  });

  it("badges staff with the role the people page gives them", () => {
    // `<a href=".../people/amos-redfern/">Amos Redfern</a><span class="badge">Lecturer</span>`
    const pattern =
      /<a href="[^"]*\/people\/([a-z0-9-]+)\/"[^>]*>([^<]+)<\/a>\s*<span class="badge"[^>]*>([^<]+)<\/span>/g;
    let found = 0;
    for (const slug of slugs) {
      for (const [, , name, badge] of pageFor(slug).matchAll(pattern)) {
        found++;
        expect(roleByName.has(name), `${slug} credits "${name}", who has no profile`).toBe(true);
        expect(badge.trim(), `${slug} badges ${name} as something the people page does not`).toBe(
          roleByName.get(name),
        );
      }
    }
    expect(found, "no staff post on the forum at all").toBeGreaterThan(0);
  });

  it("dates every post inside the teaching period", () => {
    // The forum carries no API nodes, so the shipped date is the only copy.
    const dated = /Week (\d+), (\d{1,2} \w{3,} \d{4})/g;
    let checked = 0;
    for (const slug of slugs) {
      for (const [, week, date] of pageFor(slug).matchAll(dated)) {
        checked++;
        const iso = new Date(`${date} UTC`).toISOString().slice(0, 10);
        expect(iso, `${slug} has a post dated ${date}, before teaching starts`).not.toBe(
          "Invalid Date",
        );
        expect(
          iso >= api.course.startDate && iso <= api.course.endDate,
          `${slug} has a post dated ${date}, outside ${api.course.startDate} to ${api.course.endDate}`,
        ).toBe(true);
        expect(Number(week) >= 1 && Number(week) <= 12, `${slug} cites week ${week}`).toBe(true);
      }
    }
    expect(checked, "no dated posts found to check").toBeGreaterThan(10);
  });

  it("pins the announcements and puts them at the top of the one list", () => {
    // The index is a single list now, not a Pinned section above a Discussion
    // section, so "first" is a fact about row order rather than about which
    // heading a row sits under.
    const rows = [...index.matchAll(/<li class="thread( thread--pinned)?"/g)].map((match) =>
      Boolean(match[1]),
    );
    expect(rows.length, "no threads listed").toBeGreaterThanOrEqual(5);

    const pinned = rows.filter(Boolean).length;
    expect(pinned, "nothing is pinned").toBeGreaterThan(0);
    expect(
      rows.slice(0, pinned).every(Boolean),
      "a pinned thread is listed below an unpinned one",
    ).toBe(true);

    const announcements = (index.match(/class="tag tag--announcement"/g) ?? []).length;
    expect(announcements, "an announcement is not pinned, or a pin is not an announcement").toBe(
      pinned,
    );
  });

  it("puts the counts and the last reply beside every topic", () => {
    // What makes it read as a forum rather than as a notice board: each row
    // carries its own reply count, view count and last reply.
    const rows = (index.match(/<li class="thread/g) ?? []).length;
    const replies = (index.match(/<span class="unit"[^>]*>(?:reply|replies)<\/span>/g) ?? [])
      .length;
    const views = (index.match(/<span class="unit"[^>]*>views<\/span>/g) ?? []).length;
    const latest = (index.match(/<span class="when"[^>]*>/g) ?? []).length;

    expect(replies, "a topic has no reply count").toBe(rows);
    expect(views, "a topic has no view count").toBe(rows);
    expect(latest, "a topic does not say when it last moved").toBe(rows);
  });
});
