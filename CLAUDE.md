# CLAUDE.md — harness for SLOP3068

This repo is one course website for Slop University. The deployed site is the
deliverable; this repo is how the process is read. These rules are the standard
the work runs against, not suggestions.

## The course, in one sentence

**A queue is a machine for handing out waiting, and every queue is a decision
about whose time counts for less.**

That sentence is the whole course. Every page either serves it or does not
ship. If you cannot say which part of that sentence a paragraph is carrying,
the paragraph is filler and it goes.

## What I decided a good course is

Four positions, taken from reading three courses that hold together (Calling
Bullshit, How to Make (Almost) Anything, CS 007). Each one is here because it
changed what I accepted back from the agent.

1. **One claim, held for twelve weeks.** Not a survey of a field. A course is
   an argument, and the weeks are the steps of it.
2. **A week earns its place by adding a capability.** "Covered" is not a unit
   of teaching. After week N a student can do something they could not do after
   week N-1, and the page says what.
3. **Assessment is the curriculum.** What is marked is what is learned, so the
   assessment pages are written before the lecture pages, not after.
4. **The site must not lie about the work.** Times, quantities, what to bring,
   what happens in the room. A student plans against these pages.

Positions 1, 2 and 3 are enforced in `spec/`. Position 4 is not testable and is
on me; see the rule on invented numbers below.

## Rules for the course content

- **Every teaching week 1 to 12 has exactly one lecture and exactly one field
  session, and they are the same week.** No gaps, no doubles, nothing scheduled
  in the mid-semester break. `spec/course-shape.test.ts` enforces this.
- **A lecture's `description` is the week's claim, stated as one sentence a
  student could disagree with.** Not a list of topics. If it could be the
  description of any other week, rewrite it.
- **Before writing week N, read weeks 1 to N-1.** Every week must introduce at
  least one thing that is genuinely new. No week re-teaches an earlier week's
  method under a new name; a later week may only use an earlier one.
  `spec/course-shape.test.ts` fails on a duplicated week number or title, but
  the harder half of this is a judgement and it is mine.
- **No assessment is due before the course has taught what it needs.** Every
  assessment declares `needs:` in frontmatter, listing the lecture refs whose
  methods it depends on. `spec/assessment.test.ts` resolves every ref and fails
  if any needed lecture falls on or after the due date. This is the check that
  catches a curriculum reshuffle breaking the course without breaking the
  build.
- **Assessment weights sum to 100.** The content schema enforces it per
  marking table; `spec/assessment.test.ts` enforces it across the course.
- **Every field session says what to bring and what leaves the room.** A field
  session is a thing you physically go and do. If it could be done sitting at a
  laptop it is a lecture wearing a different hat.
  `spec/course-shape.test.ts` requires the "Bring" and "What leaves the room"
  headings on every session page.
- **Numbers are real or openly invented.** Any figure presented as measured
  (arrival rates, service times, waiting times) is either sourced or written so
  a reader can see it is illustrative. Never invent a citation, a study, a
  statistic or an author. Slop University is fictional; its teaching is not
  allowed to be dishonest about evidence.
- **The fiction may have its own publications; it may never borrow real ones.**
  Staff profiles list papers, because a staff profile without them is not a
  staff profile. Every one names an invented venue, and no entry names a real
  journal, a real author or a real paper. The rule above is about not dressing
  invention up as evidence for a claim the course makes; a fictional academic's
  fictional bibliography is not that, as long as it borrows nothing real.
- **The site does not break character to explain itself.** It reads as a course
  website, not as an exercise with footnotes about being one. I had put a
  disclaimer on the people page saying the portraits were machine-generated and
  a line under the publications saying none of them exist, and both went: the
  brief asks for a course website, nothing in it asks for disclaimers, and no
  real course site carries them. Slop University is fiction all the way down
  and the fiction does not need a label on one page of it.
- **Alt text describes the file, checked against the file.** Written from
  memory it drifts, and on this site it did: two profiles carried a description
  of the wrong portrait because the faces did not land in the order I assumed.
  It also does not assert an identity a picture cannot carry.
- **Second person, present tense, for anything a student does.** "You time
  thirty arrivals." Not "students will be required to time arrivals."

## Rules for the writing

Carried forward from C1, C2, A1, C4 and C5. **The intent behind all of them is
that the work must not read as generated.** The default output has a register,
and the register is the tell.

- **No em dashes anywhere in page copy.** Use a comma, a semicolon or a full
  stop. `spec/voice.test.ts` fails the build on one in any rendered page. Code
  comments are exempt; nobody reads those on the page.
- **No slop phrases.** The banned list lives in `spec/voice.test.ts` and it
  fails the build. It covers the "not just X, but Y" construction, "delve",
  "in today's fast-paced", "tapestry", "testament to", "navigate the complexities",
  "at its core", "it's important to note", "embark on a journey", "unlock",
  "leverage" as a verb, and "the world of". Add to the list when a new one
  appears; never remove one to make a sentence pass.
- **I dropped the blanket colon ban I carried from C5.** It was written for a
  one-page prototype and it cannot survive a course site, where a colon does
  real work in a title, in a timetable and in front of a list. The tell was
  never the colon, it was the register, so the check now hunts the register.
- **Vary sentence length on purpose.** Three medium sentences in a row is the
  house style of generated prose. Break it.
- **One accent colour.** One hue plus the neutrals, from the Slop brand tokens.
  Do not introduce a second hue for variety. No gradients, no drop shadows, no
  accent bar on any edge of a panel.

## Rules for the platform

- **`README.md` is the fixed platform and it wins.** The Slop identity, the
  four collections and their keys, `astro.config.ts` and the generated API stay
  exactly as they arrived. Adding is allowed; changing those is not.
- **The collection key is the whole address.** Renaming a file means renaming
  the page, the API path and every ref that points at it, in the same commit.
- **No root-absolute `href` in an `.astro` file.** It works on the dev server
  and 404s under the Pages base path. Markdown links are rewritten for you;
  hand-written ones in components are not.
- **Everything ships in the build.** No CDN scripts, no remote fonts, no remote
  images, no runtime `fetch`. A network dependency is a way for the deployed
  site to be broken while the local one looks fine. `scripts/fetch-portraits.mjs`
  is the one thing here that touches the network, it is an authoring tool run by
  hand, and what it writes is committed.
- **No form may have an `action` or a `method`.** There is no backend, so a
  form that posts navigates the browser to a path this site does not serve,
  and a student halfway through an extension request lands on a 404. The
  submit handler takes over instead. `spec/extensions.test.ts` fails on either
  attribute.
- **A form may show a confirmation, and the extension form does.** I built it
  first as an email composer, so that nothing on the page could claim to have
  received anything, and that was the wrong instinct for this deliverable.
  This is a course website for a university that does not exist, staffed by
  people who do not exist, teaching a course nobody will sit. A submission
  confirmation is the same fiction as the office numbers and the consultation
  hours, and singling the form out for scruples made it the one part of the
  site that stopped pretending. C5's flat ban on forms was the same mistake in
  a stronger form. What the rule above still protects is the real failure: a
  request that goes nowhere because the page navigated away from it.
- **Every table column gets a non-empty header cell.** A markdown table opening
  `| | Weeks | Cost |` is a table whose first header is blank, and axe fails the
  build on it. Written down after making the identical mistake twice, once in
  the week 2 deck and once on the timetable page; if the first column has no
  name, it needs one, and the fact that it is hard to name usually means the
  table wants to be a list.
- **No comparison operators inside a template expression.** `day <= end` in an
  `.astro` template makes the scanner read the `<` as a tag and fail typecheck
  with a fragment error pointing at a completely different line. Hoist the
  comparison into the frontmatter and call it. Cost me a confusing fifteen
  minutes on the calendar.
- **Site-wide CSS goes in `src/styles/site.css`, imported from
  `src/site-config.ts`.** Not from a layout. Pages here render through three
  different layouts and a layout import silently reaches only some of them.
  Every page imports the site config, so nothing can miss it.
- **A hover detail must also open on focus, and its content must be in the
  document.** No `title` attributes, and nothing a script inserts on mouseover.
  Hover does not exist on a phone and half the marking happens there. A panel
  attached to a link goes beside the link, never inside it, or every word of it
  joins the link's accessible name.
- **Never hand-edit anything under `dist/`.**

## Rules for working

- **Never commit a red state, with one exception.** `pnpm check` passes
  before every commit, except the commit that introduces a spec test for
  content that does not exist yet. A spec test is a promise written down
  before it is kept, so its first commit is red by design and its message
  has to say so and say which test. Nothing else gets that exemption.
- **A new test must first catch a deliberate bug.** Green on first run proves
  nothing about a test's teeth. Break the thing the test forbids, watch it
  fail, then restore. Added in A1 after four property tests all stayed green
  while the central mechanic was deleted.
- **Small screens are proven on a real phone.** 390px, no horizontal overflow.
  An emulated viewport is not proof on its own; an emulated 375px check once
  passed while a real phone showed a desktop page scaled up.
- **Open the page and read it.** The rendered page is the truth; the mental
  model of it is not. This matters more here than in any previous repo, because
  the failure mode of this assignment is twenty pages that each pass every
  check and together say nothing.
- **Commit as the work lands, in the order it happened.** The commit history is
  read as evidence, so a single "build the site" commit destroys the record.

### A Windows-only note on the build

`pnpm check` needs an `npx` that Node 24 can spawn. Node refuses to resolve
`npx.cmd` from `execFile`, which is what the theme's search-index hook calls,
so the build fails with `spawn npx ENOENT` on Windows and passes in CI. The
fix is a shim on `PATH`, outside this repo; do not "fix" it by editing
`astro.config.ts` or the theme, because the platform is not the thing that is
broken.
