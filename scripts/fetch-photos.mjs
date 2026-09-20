// Fetches the photographs used through the site.
//
//   node scripts/fetch-photos.mjs           # only what is missing
//   node scripts/fetch-photos.mjs --force   # all of them again
//   node scripts/fetch-photos.mjs hero-queue
//
// An authoring tool, not part of the build, for the same reason as
// fetch-portraits.mjs: CLAUDE.md says everything ships in the build, so a
// photograph is downloaded once, re-encoded, committed, and served from this
// repo. Nothing on the deployed site reaches out to unsplash.com.
//
// The manifest lives in src/lib/photos.mjs, because the pages need the same
// alt text and credit that this script downloads against. Plain .mjs so both
// node and the Astro build can read it.
import { existsSync, writeFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";
import { PHOTOS } from "../src/lib/photos.mjs";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";

const force = process.argv.includes("--force");
const only = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const wanted = only.length > 0 ? only : Object.keys(PHOTOS);

const dir = resolve("src/assets/photos");
await mkdir(dir, { recursive: true });

for (const name of wanted) {
  const photo = PHOTOS[name];
  if (!photo) throw new Error(`no photo named "${name}" in the manifest`);

  const out = resolve(dir, `${name}.avif`);
  if (existsSync(out) && !force && only.length === 0) {
    console.log(`skip  ${name}`);
    continue;
  }

  // The bare photo id, not the slug. The slug form 404s, and several ids
  // begin with a hyphen, which is what made it look like the whole endpoint
  // was wrong the first time.
  const url = `https://unsplash.com/photos/${photo.id}/download?w=1800`;
  const response = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "image/jpeg,image/*" },
  });
  if (!response.ok) throw new Error(`${name}: ${response.status} ${response.statusText}`);

  const type = response.headers.get("content-type") ?? "";
  if (!type.startsWith("image/")) throw new Error(`${name}: expected an image, got ${type}`);

  const source = Buffer.from(await response.arrayBuffer());
  const avif = await sharp(source)
    .resize(photo.width, Math.round(photo.width * 0.5625), {
      fit: "cover",
      position: photo.position ?? "attention",
    })
    .avif({ quality: 55 })
    .toBuffer();

  writeFileSync(out, avif);
  console.log(`wrote src/assets/photos/${name}.avif (${(avif.length / 1024).toFixed(0)} kB)`);

  // Somebody else's server, one request per photo.
  await new Promise((done) => setTimeout(done, 900));
}
