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

  // Order matters: NavGroups folds each group in at the position of its first
  // item, so grouped links sit together here and the flattened list a reader
  // without JavaScript gets is in the same order as the grouped one.
  links: [
    { text: "Timetable", href: "/timetable/" },
    { text: "Lectures", href: "/lectures/" },
    { text: sessionLabels.plural, href: "/sessions/" },
    { text: "Glossary", href: "/glossary/" },
    { text: "Assessment", href: "/assessments/" },
    { text: "Extensions", href: "/extensions/" },
    { text: "Forum", href: "/forum/" },
    { text: "People", href: "/people/" },
    { text: "Policies", href: "/policies/" },
  ],

  licence: "CC-BY-NC-SA-4.0",
  socialImage: "/src/assets/images/card.png",
  socialImageAlt:
    `${courseMeta.code}. A single queue folded into five rows of gold blocks on a dark ground, each block one person, the line ending at one open counter with one server.`,
});

/** How NavGroups folds the bar. Each label is named for what it holds, so a
 *  reader can guess where the extension form lives without opening anything.
 *  Timetable and Forum stay on the bar; they are the two opened weekly. */
export const navGroups = [
  { label: "Teaching", items: ["/lectures/", "/sessions/", "/glossary/"] },
  { label: "Assessments", items: ["/assessments/", "/extensions/"] },
  { label: "Support", items: ["/people/", "/policies/"] },
];
