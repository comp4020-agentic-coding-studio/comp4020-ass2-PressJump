// The voice check, carried forward from C2 and A1 and rewritten for a site
// with twenty-odd pages on it.
//
// The old rule banned em dashes and colons outright. The colon half of it does
// not survive a course website, where a colon does honest work in a title, a
// timetable and in front of a list, so it is gone and CLAUDE.md says why. The
// tell was never the punctuation, it was the register, so this hunts the
// register: the constructions that appear when the prose is being generated
// rather than written.
//
// It runs over the rendered text of every built page, not the source, because
// the source is markdown and a component can put words on a page that no
// markdown file contains.
import { readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";
import { describe, expect, it } from "vitest";

const DIST = resolve("dist");

async function htmlFiles(dir: string): Promise<string[]> {
  const found: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      // pagefind ships its own prebuilt UI; it is not this course's prose.
      if (entry.name === "pagefind" || entry.name === "_astro") continue;
      found.push(...(await htmlFiles(full)));
    } else if (entry.name.endsWith(".html")) {
      found.push(full);
    }
  }
  return found;
}

/** The words a reader actually sees, with the machinery stripped out. */
function visibleText(html: string): string {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&mdash;/gi, "—")
    .replace(/&#8212;/g, "—")
    .replace(/&amp;/gi, "&")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ");
}

// Every one of these has turned up in generated copy in this repo or an
// earlier one. Add to the list when a new one appears. Never remove one to
// make a sentence pass; rewrite the sentence.
const SLOP = [
  /\bdelve[sd]?\b/i,
  /\bit'?s not just\b[^.]{0,80}\bit'?s\b/i,
  /\bnot merely\b[^.]{0,80}\bbut\b/i,
  /\btapestry\b/i,
  /\ba testament to\b/i,
  /\bnavigat(?:e|ing) the complexit/i,
  /\bat its core,/i,
  /\bit'?s important to note\b/i,
  /\bembark on a journey\b/i,
  /\bunlock(?:ing)? the (?:power|potential|secrets)\b/i,
  /\bleverag(?:e|ing) the\b/i,
  /\bin today'?s fast-paced\b/i,
  /\bthe world of\b/i,
  /\bdive deep\b/i,
  /\bgame-?changer\b/i,
  /\bseamless(?:ly)?\b/i,
  /\brich (?:history|tradition)\b/i,
  /\bever-?(?:evolving|changing) landscape\b/i,
];

const pages = await htmlFiles(DIST);
const text = new Map(
  pages.map((file) => [
    "/" + relative(DIST, file).split(sep).join("/"),
    visibleText(readFileSync(file, "utf8")),
  ]),
);

describe("the copy does not read as generated", () => {
  it("has pages to check at all", () => {
    expect(pages.length).toBeGreaterThan(10);
  });

  it("uses no em dash on any rendered page", () => {
    const offenders: string[] = [];
    for (const [page, body] of text) {
      const hit = body.match(/[^.]{0,60}—[^.]{0,60}/);
      if (hit) offenders.push(`${page}: ...${hit[0].trim()}...`);
    }
    expect(offenders.join("\n")).toBe("");
  });

  it("uses none of the constructions on the slop list", () => {
    const offenders: string[] = [];
    for (const [page, body] of text) {
      for (const pattern of SLOP) {
        const hit = body.match(pattern);
        if (hit) offenders.push(`${page}: ${pattern} matched "${hit[0]}"`);
      }
    }
    expect(offenders.join("\n")).toBe("");
  });
});
