// Site-wide CSS, imported here rather than from a layout because every page
// imports this module and the pages render through three different layouts.
// See the file for what it overrides and why.
// oxlint-disable-next-line import/no-unassigned-import
import "./styles/site.css";
import { defineSiteConfig } from "astro-theme-university/types";
import { slopBranding } from "astro-theme-slop";
import { courseMeta } from "./course-config";

// The underlying collection and URL remain `sessions`; these labels are the
// language students see. Change them to Studios, Tutorials, Expeditions, etc.
export const sessionLabels = {
  singular: "Field session",
  plural: "Field sessions",
} as const;

export const graphCollections = ["sessions", "assessments", "lectures", "people"];

export const courseApiCollections = [
  ...graphCollections.map((key) => ({ key })),
  { key: "policies", dir: "pages/policies" },
];

export const siteConfig = defineSiteConfig({
  ...slopBranding,
  name: "Slop University",

  // Order matters: NavMore folds the tail of this list into a "More" menu, so
  // the five a student opens weekly come first and the reference pages follow.
  links: [
    { text: "Timetable", href: "/timetable/" },
    { text: "Lectures", href: "/lectures/" },
    { text: sessionLabels.plural, href: "/sessions/" },
    { text: "Assessment", href: "/assessments/" },
    { text: "Forum", href: "/forum/" },
    { text: "People", href: "/people/" },
    { text: "Glossary", href: "/glossary/" },
    { text: "Extensions", href: "/extensions/" },
    { text: "Policies", href: "/policies/" },
  ],

  licence: "CC-BY-NC-SA-4.0",
  socialImage: "/src/assets/images/card.png",
  socialImageAlt:
    `${courseMeta.code}. A single queue folded into five rows of gold blocks on a dark ground, each block one person, the line ending at one open counter with one server.`,
});

/** The tail of `links` above, folded into the nav's "More" menu by NavMore. */
export const navMore = ["/people/", "/glossary/", "/extensions/", "/policies/"];
