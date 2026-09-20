// Position 3 in CLAUDE.md is that assessment is the curriculum. Two promises
// follow from it, and neither survives a reshuffle on its own.
//
// The first is arithmetic: the pieces add to a whole course. The content schema
// checks that one marking table's criteria sum to 100, which is a different
// claim, and nothing checks the course total.
//
// The second is the one worth having. Every assessment declares `needs:` in its
// frontmatter, listing the lectures whose methods it cannot be attempted
// without, and those lectures have to have happened first. `needs:` is not a
// schema key, so it rides through validation untouched and into the node's
// `meta` object; the build will not resolve those refs and will not compare
// those dates. Move a lecture later in the semester and the build stays green
// while the course quietly starts asking for work it has not taught yet. This
// is the check that fails instead.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  title: string;
  meta?: Record<string, unknown>;
}

interface CourseApi {
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;
const assessments = api.nodes.filter((node) => node.type === "assessments");
const nodeIds = new Set(api.nodes.map((node) => node.id));
const dateOnly = (value: unknown): string => String(value).slice(0, 10);

describe("the assessment adds up to a course", () => {
  it("carries at least three pieces, so no single artefact decides the grade", () => {
    expect(assessments.length).toBeGreaterThanOrEqual(3);
  });

  it("sums the weights to exactly 100", () => {
    const total = assessments.reduce((sum, node) => sum + Number(node.meta?.weight ?? 0), 0);
    expect(total, assessments.map((n) => `${n.id}=${n.meta?.weight}`).join(", ")).toBe(100);
  });

  it("says how every piece is marked", () => {
    for (const assessment of assessments) {
      expect(assessment.meta?.marking, `${assessment.id} has no marking model`).toBeTruthy();
    }
  });
});

describe("nothing is due before the course has taught it", () => {
  it("declares what each piece depends on", () => {
    for (const assessment of assessments) {
      const needs = assessment.meta?.needs;
      expect(Array.isArray(needs), `${assessment.id} declares no needs:`).toBe(true);
      expect((needs as string[]).length, `${assessment.id} needs: is empty`).toBeGreaterThan(0);
    }
  });

  it("resolves every declared dependency to a real lecture", () => {
    for (const assessment of assessments) {
      for (const ref of (assessment.meta?.needs as string[]) ?? []) {
        expect(nodeIds.has(ref), `${assessment.id} needs ${ref}, which is not a node`).toBe(true);
        expect(ref, `${assessment.id} needs ${ref}, which is not a lecture`).toMatch(
          /^lectures\//,
        );
      }
    }
  });

  it("teaches every dependency strictly before the due date", () => {
    for (const assessment of assessments) {
      const due = dateOnly(assessment.meta?.due);
      for (const ref of (assessment.meta?.needs as string[]) ?? []) {
        const lecture = api.nodes.find((node) => node.id === ref);
        const taught = dateOnly(lecture?.meta?.date);
        expect(
          taught < due,
          `${assessment.id} is due ${due} but ${ref} is not taught until ${taught}`,
        ).toBe(true);
      }
    }
  });
});
