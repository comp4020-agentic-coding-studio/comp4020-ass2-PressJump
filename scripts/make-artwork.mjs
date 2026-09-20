// Draws the course artwork and writes both sizes.
//
//   node scripts/make-artwork.mjs
//
// One picture, generated rather than drawn, because the thing it has to show
// is a shape rather than a scene: a single line folded back on itself five
// times to fit a room, ending at one open counter with one server. That is the
// course in a diagram, and it is also the first thing week 4 argues about.
//
// Two inks and no gradients, per CLAUDE.md. The gold is the Slop brand's
// --at-primary; the background is a dark warm neutral rather than black so the
// blocks are not fighting pure #000 on an OLED screen.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const GOLD = "#b97d1c";
const INK = "#14110c";

/** The serpentine, as a list of person blocks plus the counter. */
function artworkSvg(width, height) {
  const s = Math.min(width / 1600, height / 900);
  // Big enough that a block reads as a person rather than as a bar on a
  // barcode. The first pass used twenty-pixel blocks with a thirteen-pixel gap
  // and produced about sixty per row, which looked like a rule with texture.
  const blockW = 44 * s;
  const blockH = 78 * s;
  const gap = 30 * s;
  const rows = 5;

  const padX = 120 * s;
  const laneW = width - padX * 2;
  const perRow = Math.floor((laneW + gap) / (blockW + gap));

  const topY = height * 0.16;
  const rowPitch = (height * 0.66) / (rows - 1);

  const parts = [];

  // The lane itself, as one continuous stroked path. It is the only thing in
  // the picture that is not a person, and it is what makes five rows read as
  // one queue rather than five queues.
  const lastRowCount = Math.max(2, Math.round(perRow * 0.45));
  const counterX = padX + lastRowCount * (blockW + gap) + gap * 2.5;
  const counterW = 210 * s;
  // Where the queue actually ends. The first version ran the lane to the right
  // margin on the last row, past the counter, which drew a line of people
  // walking on to nothing.
  const laneEndX = counterX + counterW + gap * 1.5 + blockW;

  const laneY = (row) => topY + row * rowPitch + blockH / 2;
  let d = `M ${padX - gap} ${laneY(0)}`;
  for (let row = 0; row < rows; row++) {
    const leftToRight = row % 2 === 0;
    const endX =
      row === rows - 1 ? laneEndX : leftToRight ? padX + laneW + gap : padX - gap;
    d += ` L ${endX} ${laneY(row)}`;
    if (row < rows - 1) d += ` L ${endX} ${laneY(row + 1)}`;
  }
  parts.push(
    `<path d="${d}" fill="none" stroke="${GOLD}" stroke-opacity="0.32" stroke-width="${3 * s}"/>`,
  );

  // The people. Every block is one person and they are all the same size,
  // because the whole argument of the course is that the queue does not know
  // anything about them except their position.
  for (let row = 0; row < rows; row++) {
    const leftToRight = row % 2 === 0;
    const count = row === rows - 1 ? lastRowCount : perRow;
    for (let i = 0; i < count; i++) {
      const slot = leftToRight ? i : perRow - 1 - i;
      const x = padX + slot * (blockW + gap);
      const y = topY + row * rowPitch;
      parts.push(
        `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${blockW.toFixed(1)}" height="${blockH.toFixed(1)}" rx="${(4 * s).toFixed(1)}" fill="${GOLD}"/>`,
      );
    }
  }

  // The counter, at the end of the last row, and the one server behind it.
  const counterY = topY + (rows - 1) * rowPitch;
  parts.push(
    `<rect x="${counterX.toFixed(1)}" y="${(counterY + blockH * 0.32).toFixed(1)}" width="${counterW.toFixed(1)}" height="${(blockH * 0.36).toFixed(1)}" fill="none" stroke="${GOLD}" stroke-width="${5 * s}"/>`,
  );
  parts.push(
    `<rect x="${(counterX + counterW + gap * 1.5).toFixed(1)}" y="${counterY.toFixed(1)}" width="${blockW.toFixed(1)}" height="${blockH.toFixed(1)}" rx="${(3 * s).toFixed(1)}" fill="none" stroke="${GOLD}" stroke-width="${5 * s}"/>`,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<rect width="${width}" height="${height}" fill="${INK}"/>
${parts.join("\n")}
</svg>`;
}

const outputs = [
  { path: "src/assets/images/hero-home.avif", width: 1600, height: 900, format: "avif" },
  { path: "src/assets/images/card.png", width: 1200, height: 630, format: "png" },
];

for (const { path, width, height, format } of outputs) {
  const file = resolve(path);
  mkdirSync(dirname(file), { recursive: true });
  const svg = Buffer.from(artworkSvg(width, height));
  const image = sharp(svg, { density: 96 });
  const buffer =
    format === "avif" ? await image.avif({ quality: 70 }).toBuffer() : await image.png().toBuffer();
  writeFileSync(file, buffer);
  console.log(`wrote ${path} (${width}x${height}, ${buffer.length} bytes)`);
}
