// Site-wide chrome has to actually be site-wide.
//
// The nav grouping is a script, and a script has to be placed on every page
// that renders a nav. This site has three layouts, so that is nine entry
// points and nine chances to forget one. Forgetting one is invisible: the page
// looks fine, it just has nine flat links where every other page has five
// items and three menus. This is the check that makes it not invisible.
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

  it("puts the grouping script on every one of them", () => {
    const missing = navPages
      .filter((page) => !page.html.includes("at-nav-group"))
      .map((page) => page.path);
    expect(missing.join(", "), "these pages ship the nav ungrouped").toBe("");
  });

  it("groups the same way on every page", () => {
    // The groups are defined once in site-config; if a page were passed a
    // different set the bar would reorganise differently page to page.
    //
    // Astro's define:vars emits `const groups = [...]`, not JSON. An earlier
    // pattern here was loose enough to also match `align-items: baseline` in
    // the inlined CSS, which is how it reported "none" on every page.
    const sets = new Set(
      navPages.map((page) => {
        const match = page.html.match(/const groups\s*=\s*(\[[\s\S]*?\]);/);
        return match ? match[1].replace(/\s+/g, "") : "none";
      }),
    );
    expect(sets.size, `the grouping differs between pages: ${[...sets].join(" vs ")}`).toBe(1);
    const only = [...sets][0];
    expect(only, "no grouping found in the page").not.toBe("none");
    // Named groups, not a single catch-all. "More" tells a reader nothing
    // about what is behind it, which was the first version and the reason
    // this assertion exists.
    const labels = [...only.matchAll(/"label":"([^"]+)"/g)].map((m) => m[1]);
    expect(labels.length, "fewer than two named groups").toBeGreaterThanOrEqual(2);
    expect(labels, "a group is called More").not.toContain("More");
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
    expect(navPages[0].html, "the menus ship already built").not.toMatch(
      /<li class="at-nav-group"/,
    );
  });
})

// The theme turns on <ClientRouter>, so a link click swaps the document
// instead of reloading it. Astro executes a module script once per URL, so
// anything that set itself up at parse time never runs again: the nav came
// back ungrouped, the calendar lost its paging and the forms went inert on
// every page reached by clicking, while every page reached by reloading was
// fine. Every script the theme itself ships binds to `astro:page-load`.
//
// This reads the source rather than the build because that is where the
// mistake is made, and because a script that never re-runs is invisible in
// the rendered HTML: the markup is identical either way.
describe("client scripts survive a view transition", () => {
  const roots = ["src/components", "src/pages", "src/layouts"];

  const walk = (dir: string): string[] => {
    const out: string[] = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) out.push(...walk(full));
      else if (entry.name.endsWith(".astro")) out.push(full);
    }
    return out;
  };

  const withScripts = roots
    .flatMap((root) => walk(resolve(root)))
    .map((file) => ({ file, source: readFileSync(file, "utf8") }))
    .filter(({ source }) => /<script[^>]*>/.test(source));

  it("finds the components that ship a script", () => {
    expect(withScripts.length, "no component ships a script").toBeGreaterThanOrEqual(4);
  });

  it("binds every one of them to astro:page-load", () => {
    // The listener, not the string. Every one of these files explains the
    // binding in a comment, so `includes("astro:page-load")` matched even
    // after I deleted the listener; the planted regression stayed green.
    const bound = /addEventListener\(\s*["']astro:page-load["']/;
    const missing = withScripts
      .filter(({ source }) => !bound.test(source))
      .map(({ file }) => relative(resolve("."), file).split(sep).join("/"));
    expect(
      missing.join(", "),
      "these run once and go inert on every page reached by clicking a link",
    ).toBe("");
  });
});
