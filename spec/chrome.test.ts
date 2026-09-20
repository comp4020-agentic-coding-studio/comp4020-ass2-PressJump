// Site-wide chrome has to actually be site-wide.
//
// The nav "More" group is a script, and a script has to be placed on every
// page that renders a nav. This site has three layouts, so that is nine entry
// points and nine chances to forget one. Forgetting one is invisible: the page
// looks fine, it just has nine flat links where every other page has six and a
// menu. This is the check that makes it not invisible.
//
// Same reasoning for the stylesheet, which is imported from site-config for
// exactly this reason rather than from a layout.
import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { describe, expect, it } from "vitest";

const DIST = resolve("dist");

function htmlFiles(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      // The decks are reveal.js pages rendered by astromotion, with no site
      // nav on them at all, so the chrome does not apply.
      if (entry.name === "pagefind" || entry.name === "_astro" || entry.name === "decks") continue;
      found.push(...htmlFiles(full));
    } else if (entry.name.endsWith(".html")) {
      found.push(full);
    }
  }
  return found;
}

const pages = htmlFiles(DIST).map((file) => ({
  path: "/" + relative(DIST, file).split(sep).join("/"),
  html: readFileSync(file, "utf8"),
}));

/** Pages that render the site navigation. */
const navPages = pages.filter((page) => page.html.includes('class="at-nav'));

describe("site chrome", () => {
  it("renders a nav on every page but the decks", () => {
    expect(pages.length).toBeGreaterThan(20);
    expect(navPages.length, "a page shipped with no site navigation").toBe(pages.length);
  });

  it("puts the More menu script on every one of them", () => {
    const missing = navPages
      .filter((page) => !page.html.includes("at-nav-more"))
      .map((page) => page.path);
    expect(missing.join(", "), "these pages ship the nav ungrouped").toBe("");
  });

  it("names the same folded links everywhere", () => {
    // The group is defined once in site-config; if a page were passed a
    // different list the bar would reorganise differently page to page.
    const lists = new Set(
      navPages.map((page) => {
        // Astro's define:vars emits `const items = [...]`, not JSON. An
        // earlier, looser pattern also matched the `align-items: baseline`
        // in the inlined CSS, which is how it found "none" on every page.
        const match = page.html.match(/const items\s*=\s*(\[[^\]]*\])/);
        return match ? match[1].replace(/\s+/g, "") : "none";
      }),
    );
    expect(lists.size, `the folded set differs between pages: ${[...lists].join(" vs ")}`).toBe(1);
    expect([...lists][0], "no folded set found in the page").not.toBe("none");
  });

  it("ships the nav flat, so a reader without a script gets every link", () => {
    // The grouping happens in the browser. What the server sends is the
    // theme's own list, and every link in it has to be there.
    for (const href of ["/lectures/", "/sessions/", "/assessments/", "/people/", "/policies/"]) {
      expect(
        navPages[0].html,
        `${href} is missing from the navigation the server sends`,
      ).toContain(href);
    }
    expect(navPages[0].html, "the menu ships already built").not.toMatch(
      /<li class="at-nav-more"/,
    );
  });
})
