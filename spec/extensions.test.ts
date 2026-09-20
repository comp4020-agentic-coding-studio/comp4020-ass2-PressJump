// The extension page is the one page on this site a student uses when
// something has already gone wrong, so the ways it can fail are the ways that
// matter most.
//
// It cannot send anything. This site is a set of files. What it can do is
// compose the email correctly and address it to somebody who exists, and those
// are the two things checked here, plus the no-JavaScript path, because a
// student without a working script still needs to ask for an extension.
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

  it("addresses the request to somebody who actually exists", () => {
    const to = html.match(/data-to="([^"]+)"/)?.[1];
    expect(to, "the form names no recipient").toBeTruthy();
    const convenor = people.find((person) => person.meta?.role === "Convenor");
    expect(convenor, "nobody on the people page is the convenor").toBeTruthy();
    expect(to, "extension requests go to an address no profile claims").toBe(
      convenor?.meta?.email,
    );
  });

  it("never claims to submit anything", () => {
    const forms = [...html.matchAll(/<form\b[^>]*>/g)].map((match) => match[0]);
    expect(forms.length, "no form on the page at all").toBeGreaterThan(0);
    for (const form of forms) {
      expect(form, "a form with an action is a form pretending to send").not.toMatch(/\saction=/);
      expect(form, "a form with a method is a form pretending to send").not.toMatch(/\smethod=/);
    }
  });

  it("leaves a way to ask without JavaScript", () => {
    const section = html.match(/<section class="request"[^>]*>/)?.[0];
    expect(section, "no request section in the markup").toBeTruthy();
    expect(section, "the form ships visible, so a no-JS reader gets a dead button").toMatch(
      /\shidden[\s>]/,
    );
    // The written-out template and the subject-line format are plain page
    // copy, so they are there whatever the script does.
    expect(html, "no written template for somebody without the form").toMatch(
      /Or write it yourself/,
    );
    expect(html, "the template does not show the subject line format").toMatch(
      /Extension request/,
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
