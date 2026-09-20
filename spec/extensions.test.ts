// The extension page is the one page on this site a student uses when
// something has already gone wrong, so the ways it can fail are the ways that
// matter most.
//
// It offers every piece, it names whoever actually runs the course, and it
// never navigates the browser somewhere this site does not serve. That last
// one is the check with teeth: a form that grows an `action` pointing at a
// path with no page behind it sends a student halfway through an extension
// request straight to a 404, which is the worst 404 on the site.
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
const html = readFileSync(resolve("dist/extensions/index.html"), "utf8");
const policies = readFileSync(resolve("dist/policies/index.html"), "utf8");

const assessments = api.nodes.filter((node) => node.type === "assessments");
const people = api.nodes.filter((node) => node.type === "people");

/** The JSON the component hands to its own script. */
const options = (() => {
  const match = html.match(/data-options="([^"]*)"/);
  if (!match) return [] as { id: string; title: string; lateness: string }[];
  const decoded = match[1]
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&amp;/g, "&");
  return JSON.parse(decoded) as { id: string; title: string; lateness: string }[];
})();

describe("asking for an extension", () => {
  it("offers every assessment, and nothing that is not one", () => {
    const offered = options.map((option) => `assessments/${option.id}`).sort();
    const expected = assessments.map((node) => node.id).sort();
    expect(offered).toEqual(expected);
  });

  it("routes the request to whoever actually runs the course", () => {
    const decider = html.match(/data-decider="([^"]+)"/)?.[1];
    expect(decider, "the form names nobody as the decision maker").toBeTruthy();
    const convenor = people.find((person) => person.meta?.role === "Convenor");
    expect(convenor, "nobody on the people page is the convenor").toBeTruthy();
    expect(decider, "the form names somebody who is not the convenor").toBe(convenor?.title);
  });

  it("never navigates anywhere this site does not serve", () => {
    const forms = [...html.matchAll(/<form\b[^>]*>/g)].map((match) => match[0]);
    expect(forms.length, "no form on the page at all").toBeGreaterThan(0);
    for (const form of forms) {
      expect(form, "an action posts a student straight into a 404").not.toMatch(/\saction=/);
      expect(form, "a method posts a student straight into a 404").not.toMatch(/\smethod=/);
    }
  });

  it("ships the confirmation hidden, and says what to do without a script", () => {
    const confirmation = html.match(/<div class="sent"[^>]*>/)?.[0];
    expect(confirmation, "no confirmation panel in the markup").toBeTruthy();
    expect(confirmation, "the confirmation ships visible, before anybody has submitted").toMatch(
      /\shidden[\s>]/,
    );
    expect(html, "nothing tells a reader without JavaScript what to do").toMatch(/<noscript>/);
  });

  it("asks for a declaration before it will take a request", () => {
    expect(html, "no required declaration checkbox").toMatch(
      /id="ext-declare"[^>]*\srequired/,
    );
  });

  it("states the same late-work rule here and on the policies page", () => {
    for (const assessment of assessments) {
      const lateness = String(assessment.meta?.lateness ?? "");
      expect(lateness, `${assessment.id} declares no lateness rule`).not.toBe("");
      expect(policies, `${assessment.id} is missing from the policies table`).toContain(
        assessment.title,
      );
    }
    // One table, rendered twice from the same frontmatter. If somebody types a
    // second copy on either page these counts stop agreeing.
    const rowsHere = (html.match(/data-label="Late penalty"/g) ?? []).length;
    const rowsThere = (policies.match(/data-label="Late penalty"/g) ?? []).length;
    expect(rowsHere).toBe(assessments.length);
    expect(rowsThere).toBe(assessments.length);
  });
});
