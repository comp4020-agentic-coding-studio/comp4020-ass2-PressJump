// A staff profile is the page a student acts on: they turn up at the office,
// they ring the number, they email at the hour it says. Three promises, and
// the build checks none of them.
//
// The one that matters is the third. Each profile lists the weeks that person
// teaches, and that list is derived from the lecture and session pages rather
// than typed into the profile. Typed, it would be a second copy of the
// timetable, and the two would disagree by week 3 without anything failing.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  title: string;
  meta?: Record<string, unknown>;
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as {
  nodes: ApiNode[];
};

const people = api.nodes.filter((node) => node.type === "people");
const teaching = api.nodes.filter(
  (node) => node.type === "lectures" || node.type === "sessions",
);

const pageFor = (id: string): string =>
  readFileSync(resolve("dist", "people", id.replace(/^people\//, ""), "index.html"), "utf8");

/** Which weeks the timetable says this person teaches. */
function weeksTaught(personId: string): number[] {
  const slug = personId.replace(/^people\//, "");
  return teaching
    .filter((node) => {
      const teachers = node.meta?.teachers;
      return Array.isArray(teachers) && teachers.includes(slug);
    })
    .map((node) => Number(node.meta?.week))
    .sort((a, b) => a - b);
}

describe("staff profiles", () => {
  it("has a profile for everybody who teaches", () => {
    expect(people.length).toBeGreaterThanOrEqual(3);
    for (const node of teaching) {
      const teachers = node.meta?.teachers;
      expect(Array.isArray(teachers) && teachers.length > 0, `${node.id} names no teacher`).toBe(
        true,
      );
    }
  });

  it("says where to find each person and when", () => {
    for (const person of people) {
      const html = pageFor(person.id);
      expect(html, `${person.id} lists no role`).toMatch(/>Role</);
      expect(html, `${person.id} lists no consultation time`).toMatch(/>Consultation</);
    }
  });

  it("lists exactly the weeks the timetable says each person teaches", () => {
    for (const person of people) {
      const expected = weeksTaught(person.id);
      if (expected.length === 0) continue;
      const html = pageFor(person.id);
      const shown = [...html.matchAll(/>Week (\d+)</g)]
        .map((match) => Number(match[1]))
        .sort((a, b) => a - b);
      expect(shown, `${person.id} teaching list disagrees with the timetable`).toEqual(expected);
    }
  });

  // Dropped a test here that asserted every `teachers:` ref resolves. The
  // build already refuses a dangling content reference and says so by name, so
  // that test could never fail on its own and was decoration.
  //
  // This is the direction the build cannot see. A profile nobody teaches from
  // is how a staff page rots: the person moves on, their lectures get
  // reassigned, and their page sits there with an office number and
  // consultation hours a student will turn up to.
  it("carries no profile for somebody who teaches nothing", () => {
    const teachers = new Set(
      teaching.flatMap((node) => ((node.meta?.teachers as string[]) ?? [])),
    );
    for (const person of people) {
      const slug = person.id.replace(/^people\//, "");
      expect(
        teachers.has(slug),
        `${person.id} is on the people page but teaches nothing this semester`,
      ).toBe(true);
    }
  });
});
