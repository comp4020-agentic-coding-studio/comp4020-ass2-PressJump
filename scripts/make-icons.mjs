// Draws the five card icons.
//
//   node scripts/make-icons.mjs
//
// Same two inks and the same vocabulary as the hero in make-artwork.mjs: a
// block is a person, an outline is a thing that serves them. Written as a
// generator rather than five hand-drawn files so the tile size, palette,
// stroke weight and block proportions cannot drift apart one icon at a time.
//
// These stay SVG. Card.astro passes a vector source through unrasterised, and
// at 320x180 on a card an AVIF of this would be larger than the markup.
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const GOLD = "#b97d1c";
const INK = "#14110c";
const W = 320;
const H = 180;
const STROKE = 3;

const block = (x, y, w = 16, h = 30, fill = true) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" ${
    fill ? `fill="${GOLD}"` : `fill="none" stroke="${GOLD}" stroke-width="${STROKE}"`
  }/>`;

const line = (x1, y1, x2, y2, opacity = 1) =>
  `<path d="M ${x1} ${y1} L ${x2} ${y2}" stroke="${GOLD}" stroke-width="${STROKE}" stroke-opacity="${opacity}" fill="none"/>`;

const tile = (title, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${title}">
<rect width="${W}" height="${H}" fill="${INK}"/>
${body}
</svg>`;

/** Twelve weeks as a grid, with one week picked out. A calendar reduced to
 *  the only thing it is actually for. */
function timetable() {
  const parts = [];
  const cols = 6;
  const rows = 2;
  const cw = 40;
  const ch = 44;
  const x0 = (W - cols * cw) / 2 + 4;
  const y0 = (H - rows * ch) / 2 + 2;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const week = r * cols + c;
      // Week 5 is the first assessment, so it is the one drawn as an outline.
      parts.push(block(x0 + c * cw, y0 + r * ch, 26, 30, week !== 4));
    }
  }
  return tile("A grid of twelve weeks, one of them outlined", parts.join("\n"));
}

/** One wide outline with rules in it, faced by a row of blocks. A board and
 *  the people in front of it. */
function lectures() {
  const parts = [`<rect x="60" y="24" width="200" height="74" rx="3" fill="none" stroke="${GOLD}" stroke-width="${STROKE}"/>`];
  for (let i = 0; i < 3; i++) parts.push(line(78, 44 + i * 18, 78 + [160, 120, 140][i], 44 + i * 18, 0.55));
  for (let i = 0; i < 7; i++) parts.push(block(64 + i * 28, 122, 16, 30));
  return tile("A board with three lines of writing, faced by a row of people", parts.join("\n"));
}

/** A clipboard with tallies. The whole instrument, per the week 2 session. */
function sessions() {
  const parts = [
    `<rect x="104" y="26" width="112" height="128" rx="4" fill="none" stroke="${GOLD}" stroke-width="${STROKE}"/>`,
    `<rect x="142" y="16" width="36" height="20" rx="3" fill="${GOLD}"/>`,
  ];
  // Four tallies struck through, twice, then a partial group.
  for (let group = 0; group < 3; group++) {
    const gy = 62 + group * 32;
    const count = group === 2 ? 3 : 4;
    for (let i = 0; i < count; i++) parts.push(line(124 + i * 14, gy, 124 + i * 14, gy + 20));
    if (group < 2) parts.push(line(118, gy + 18, 124 + 3 * 14 + 6, gy + 2));
  }
  return tile("A clipboard with two struck tally groups and a third in progress", parts.join("\n"));
}

/** The four weights as bars, in the order the semester runs them. */
function assessment() {
  const weights = [25, 20, 20, 35];
  const parts = [];
  const bw = 40;
  const gap = 24;
  const x0 = (W - (weights.length * bw + (weights.length - 1) * gap)) / 2;
  const base = 148;
  const scale = 2.9;
  weights.forEach((weight, i) => {
    const h = weight * scale;
    parts.push(block(x0 + i * (bw + gap), base - h, bw, h, true));
  });
  parts.push(line(x0 - 12, base + 6, x0 + weights.length * (bw + gap) - gap + 12, base + 6, 0.45));
  return tile("Four bars of different heights standing on a rule", parts.join("\n"));
}

/** Four people, one of them drawn as an outline. The one behind the counter. */
function people() {
  const parts = [];
  const x0 = 76;
  for (let i = 0; i < 4; i++) parts.push(block(x0 + i * 46, 58, 26, 58, i !== 3));
  parts.push(line(x0 - 10, 132, x0 + 3 * 46 - 14, 132, 0.45));
  return tile("Four figures side by side, the last one drawn as an outline", parts.join("\n"));
}

const icons = {
  "timetable.svg": timetable(),
  "lectures.svg": lectures(),
  "sessions.svg": sessions(),
  "assessment.svg": assessment(),
  "people.svg": people(),
};

const dir = resolve("src/assets/icons");
mkdirSync(dir, { recursive: true });
for (const [name, svg] of Object.entries(icons)) {
  writeFileSync(resolve(dir, name), `${svg}\n`);
  console.log(`wrote src/assets/icons/${name} (${svg.length} bytes)`);
}

// --- Diagrams -------------------------------------------------------------
// Bigger than an icon and doing real work on a page, so they live apart.

const DW = 760;
const DH = 300;

// The lane depths on the left. They add to the number of blocks drawn on the
// right, because a diagram about the same people arranged two ways cannot show
// twenty of them on one side and nine on the other. The first version did, and
// the pooled line also ran off the right edge of the canvas.
const LANES = [3, 1, 4, 2, 2];
const POOLED_TOTAL = LANES.reduce((sum, n) => sum + n, 0);

/** Week 4's whole argument in one picture: the same five servers, arranged
 *  two ways. Left, five lines into five counters. Right, one line into the
 *  same five. Same capacity, different wait, and only one of them lets a
 *  customer be stuck behind somebody else's difficult transaction. */
function pooling() {
  const parts = [`<rect width="${DW}" height="${DH}" fill="${INK}"/>`];
  const bw = 13;
  const bh = 26;
  const gap = 7;

  const label = (x, y, text) =>
    `<text x="${x}" y="${y}" fill="${GOLD}" font-family="system-ui, sans-serif" font-size="15" font-weight="600">${text}</text>`;
  const counter = (x, y) =>
    `<rect x="${x}" y="${y}" width="34" height="10" fill="none" stroke="${GOLD}" stroke-width="2.5"/>`;

  parts.push(label(24, 34, "Five lines"));
  for (let lane = 0; lane < 5; lane++) {
    const y = 56 + lane * 44;
    parts.push(counter(24, y + bh / 2 - 5));
    // Uneven queues, because that is the point: nobody balances them.
    const n = LANES[lane];
    for (let i = 0; i < n; i++) parts.push(block(70 + i * (bw + gap), y, bw, bh));
  }

  parts.push(`<path d="M 260 44 L 260 ${DH - 24}" stroke="${GOLD}" stroke-opacity="0.3" stroke-width="2"/>`);

  parts.push(label(288, 34, "One line, same five counters"));
  for (let lane = 0; lane < 5; lane++) {
    const y = 56 + lane * 44;
    parts.push(counter(288, y + bh / 2 - 5));
  }
  // One lane feeding all five, drawn as a bracket into the counters.
  parts.push(
    `<path d="M 336 ${56 + bh / 2} L 360 ${56 + bh / 2} L 360 ${56 + 4 * 44 + bh / 2} L 336 ${56 + 4 * 44 + bh / 2}" fill="none" stroke="${GOLD}" stroke-opacity="0.45" stroke-width="2"/>`,
  );
  const mid = 56 + 2 * 44;
  parts.push(`<path d="M 360 ${mid + bh / 2} L 384 ${mid + bh / 2}" stroke="${GOLD}" stroke-opacity="0.45" stroke-width="2"/>`);
  for (let i = 0; i < POOLED_TOTAL; i++) parts.push(block(390 + i * (bw + gap), mid, bw, bh));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${DW}" height="${DH}" viewBox="0 0 ${DW} ${DH}">
${parts.join("\n")}
</svg>`;
}

const diagrams = { "pooling.svg": pooling() };
const diagramDir = resolve("src/assets/diagrams");
mkdirSync(diagramDir, { recursive: true });
for (const [name, svg] of Object.entries(diagrams)) {
  writeFileSync(resolve(diagramDir, name), `${svg}\n`);
  console.log(`wrote src/assets/diagrams/${name} (${svg.length} bytes)`);
}
