// Every photograph on the site, with where it came from and what is in it.
//
// Plain JavaScript rather than TypeScript so `scripts/fetch-photos.mjs` can
// import the same file node-side that the pages import at build time. One
// manifest: the alt text that ships is the alt text the picture was chosen
// for, and a credit cannot drift away from the file it belongs to.
//
// All of these are Unsplash photographs. The licence does not require
// attribution and the site gives it anyway, which for a course about whose
// work is visible seems like the least it could do.

/**
 * @typedef {object} Photo
 * @property {string} id       Unsplash photo id, the bare code from the URL.
 * @property {string} credit   Photographer, rendered under the picture.
 * @property {string} alt      What is in the frame, for somebody who cannot see it.
 * @property {number} width    Width to store, height follows at 16:9.
 * @property {string} [position] sharp crop position; defaults to "attention".
 */

/** @type {Record<string, Photo>} */
export const PHOTOS = {
  "hero-queue": {
    id: "-yjUzBUqVTU",
    credit: "Dominic Kurniawan Suryaputra",
    alt: "People standing along a rail in a line, spaced out, all facing the same way",
    width: 1400,
  },
  // The queue runs along the bottom of this frame and "attention" cropped to
  // the building above it, which left the caption talking about people you
  // could barely see.
  "shopfront-queue": {
    id: "SsBI9pweAeA",
    credit: "Melanie Klepper",
    alt: "A queue running along the pavement outside a shop front, bunched in places and thin in others",
    width: 1400,
    position: "bottom",
  },
  checkout: {
    id: "WNzniTfWNCA",
    credit: "Enkhjin photography",
    alt: "Groceries moving along a belt towards a supermarket checkout",
    width: 1400,
  },
  // Not a Getty-licensed photo. Those are listed on Unsplash like any other
  // and then 403 on download, which is worth knowing before picking one.
  "waiting-room": {
    id: "rqdWlkRzerg",
    credit: "Navy Medicine",
    alt: "People sitting along both sides of a hallway lined with chairs, waiting",
    width: 1400,
  },
  platform: {
    id: "5JH3PitJupI",
    credit: "Connor Gan",
    alt: "A dense crowd waiting the length of a train platform under signage",
    width: 1400,
  },
  // `position: "attention"` picks the highest-entropy region, which on a
  // close-up of paper found a blank corner and cropped to it. Centre is the
  // right default for anything whose subject is already in the middle.
  clipboard: {
    id: "IZj7vckPGiw",
    credit: "engin akyurt",
    alt: "An open notebook of lined pages with a ballpoint pen resting above it",
    width: 1400,
    position: "centre",
  },
};
