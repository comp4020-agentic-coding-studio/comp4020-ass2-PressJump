// The shape of the course, asserted against what actually built.
//
// Position 1 in CLAUDE.md is that a course is one claim held for twelve weeks,
// and position 2 is that a week earns its place by adding a capability. Neither
// is fully testable, but the scaffolding they need is: twelve weeks, each with
// exactly one lecture and exactly one field session, on the dates the course
// record implies, with no two weeks wearing the same title.
//
// The build already refuses a dangling `related:` ref and a date outside the
// teaching period. What it cannot see is a missing week 9, a session that
// drifted a fortnight from its lecture, or a field session page that forgot to
// say what to bring, and those are the ways a course website stops agreeing
// with itself.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  title: string;
  description: string;
  related: string[];
  meta?: Record<string, unknown>;
  body?: string;
}

interface CourseApi {
  course: { startDate: string; endDate: string };
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;

const WEEKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
// Weeks 1 to 6 run straight from the start date; weeks 7 to 12 sit two weeks
// later because of the mid-semester break. Lectures are Monday, field sessions
// the Wednesday of the same week.
const BREAK_WEEKS = 2;
const FIRST_POST_BREAK_WEEK = 7;
const SESSION_OFFSET_DAYS = 2;

const dayMs = 86_400_000;
const dateOnly = (value: unknown): string => String(value).slice(0, 10);
const addDays = (iso: string, days: number): string =>
  new Date(Date.parse(`${iso}T00:00:00Z`) + days * dayMs).toISOString().slice(0, 10);

function expectedLectureDate(week: number): string {
  const offsetWeeks = week - 1 + (week >= FIRST_POST_BREAK_WEEK ? BREAK_WEEKS : 0);
  return addDays(api.course.startDate, offsetWeeks * 7);
}

const byType = (type: string): ApiNode[] => api.nodes.filter((node) => node.type === type);
const lectures = byType("lectures");
const sessions = byType("sessions");

describe("the twelve weeks", () => {
  it("runs a lecture and a field session in every week, and only in those weeks", () => {
    for (const week of WEEKS) {
      const weekLectures = lectures.filter((node) => node.meta?.week === week);
      const weekSessions = sessions.filter((node) => node.meta?.week === week);
      expect(weekLectures.map((n) => n.id), `week ${week} lectures`).toHaveLength(1);
      expect(weekSessions.map((n) => n.id), `week ${week} field sessions`).toHaveLength(1);
    }
    expect(lectures, "a lecture outside weeks 1 to 12").toHaveLength(WEEKS.length);
    expect(sessions, "a field session outside weeks 1 to 12").toHaveLength(WEEKS.length);
  });

  it("puts every week on the date the course record implies", () => {
    for (const week of WEEKS) {
      const lecture = lectures.find((node) => node.meta?.week === week);
      const session = sessions.find((node) => node.meta?.week === week);
      const monday = expectedLectureDate(week);
      expect(dateOnly(lecture?.meta?.date), `${lecture?.id}`).toBe(monday);
      expect(dateOnly(session?.meta?.date), `${session?.id}`).toBe(
        addDays(monday, SESSION_OFFSET_DAYS),
      );
    }
  });

  it("schedules nothing inside the mid-semester break", () => {
    const breakStart = addDays(expectedLectureDate(FIRST_POST_BREAK_WEEK - 1), 7);
    const breakEnd = addDays(expectedLectureDate(FIRST_POST_BREAK_WEEK), -1);
    for (const node of api.nodes) {
      const raw = node.type === "assessments" ? node.meta?.due : node.meta?.date;
      if (!raw) continue;
      const date = dateOnly(raw);
      expect(
        date < breakStart || date > breakEnd,
        `${node.id} on ${date} falls in the break (${breakStart} to ${breakEnd})`,
      ).toBe(true);
    }
  });
});

describe("no week is another week wearing a different hat", () => {
  it("gives every lecture and every session its own title", () => {
    for (const group of [lectures, sessions]) {
      const titles = group.map((node) => node.title.trim().toLowerCase());
      expect(new Set(titles).size, `repeated title in ${group[0]?.type}`).toBe(titles.length);
    }
  });

  it("states each week's claim as one sentence, not a list of topics", () => {
    for (const lecture of lectures) {
      const claim = lecture.description.trim();
      expect(claim.length, `${lecture.id} description is too short to be a claim`).toBeGreaterThan(
        40,
      );
      expect(claim, `${lecture.id} description should end in a full stop`).toMatch(/[.?]$/);
      expect(claim, `${lecture.id} description reads as a topic list`).not.toMatch(/,.*,.*,/);
    }
    const claims = lectures.map((node) => node.description.trim().toLowerCase());
    expect(new Set(claims).size, "two lectures claim the same thing").toBe(claims.length);
  });
});

describe("a field session is a thing you go and do", () => {
  // The generated API carries frontmatter, not page bodies, so this reads the
  // page that shipped. That is the better source anyway: a heading that exists
  // in the markdown and never reaches the page is not a promise kept.
  const headingsOf = (id: string): string[] => {
    const slug = id.replace(/^sessions\//, "");
    const html = readFileSync(resolve("dist", "sessions", slug, "index.html"), "utf8");
    // The theme appends a "#" permalink anchor inside every content heading,
    // so the tag strip leaves it behind.
    return [...html.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi)].map((match) =>
      match[1]
        .replace(/<[^>]+>/g, "")
        .replace(/#\s*$/, "")
        .trim(),
    );
  };

  it("tells every student what to bring and what leaves the room", () => {
    for (const session of sessions) {
      const headings = headingsOf(session.id);
      expect(headings, `${session.id} never says what to bring`).toContain("Bring");
      expect(headings, `${session.id} never says what leaves the room`).toContain(
        "What leaves the room",
      );
    }
  });

  it("wires each session to its own week's lecture", () => {
    for (const session of sessions) {
      const week = session.meta?.week;
      const lecture = lectures.find((node) => node.meta?.week === week);
      const linked =
        session.related.includes(lecture?.id ?? "") ||
        (lecture?.related ?? []).includes(session.id);
      expect(linked, `${session.id} and ${lecture?.id} are in week ${week} and never refer`).toBe(
        true,
      );
    }
  });
});
