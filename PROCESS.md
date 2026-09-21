# Process

**The position came before the topic.** I read Calling Bullshit, How to Make
(Almost) Anything and CS 007 looking for what they share. It is not subject or
register. Each is one claim held for a semester rather than a survey with a
reading list attached. So before any content I wrote four positions into
`CLAUDE.md` and, against each, whether I would enforce it or carry it myself
([`610a4a6`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/610a4a6)).
The sentence at the top of that file, that every queue is a decision about whose
time counts for less, is what every paragraph gets tested against.

**What I encoded.** Position three, assessment is the curriculum, is the
sequencing call I would defend hardest. The four briefs were written before any
lecture
([`cd448b4`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/cd448b4)),
so the weeks exist to make them possible. The
check that protects it is `needs:`
([`5cbb4a9`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/5cbb4a9)).
Every assessment names the lectures it cannot be attempted without, and the test
fails if any is taught on or after the due date. The obvious check was weights
summing to 100. I wrote that too, but it is arithmetic I would notice. `needs:`
catches what I would not, because it is not a schema key, so the build never
looks at it. Drag one lecture a fortnight later and the build stays green while
the course asks for work it has not taught.

**What I left out.** That every week must add a capability is the position I
care most about and there is no honest test for it, so `CLAUDE.md` says the
judgement half is mine and `spec/course-shape.test.ts` enforces only the
scaffolding. Writing every session to a fixed shape did more work than any test.
A Bring heading and a What leaves the room heading killed three sessions I had
drafted, because "the ethics of priority" had nothing to bring and nothing
leaving the room, which told me it was a lecture wearing a different label
([`e1ca8be`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/e1ca8be)).

**The call I nearly got wrong.** My em dash check went red on the platform
rather than on my prose, since the theme builds every document title with one
and the theme is fixed. The tempting fix was demoting the rule to a warning.
I moved its scope instead, so it reads the body and not the head, because a
check that fails on something I am not allowed to change only ever teaches me to
weaken it
([`429508d`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/429508d)).

**How I knew it was right.** I planted four bugs and watched each fail the right
test: week 11 dragged past The Redesign's deadline, a weight moved from 20 to
25, a Bring heading renamed, one em dash. Then the things no test caught. Axe
complained about one page, and going looking rather than deleting it found four
`.mdx` pages shipping with no `<html lang>`, no `<title>` and no navigation
([`55c643b`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/55c643b)).
Reading the rendered pages found my opening paragraph restating what the hero
already prints
([`eed1561`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/eed1561)).
The worst one only clicking found. The nav was missing on every page reached by
a link and present on every page reloaded, because `<ClientRouter>` swaps the
document and a parse-time script never runs twice
([`63961a9`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/63961a9)).
Every check stayed green throughout, since the shipped HTML is identical either
way, which is why the later rebuilds, the forum
([`d1c549e`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/d1c549e))
and the assessment briefs
([`38fa27b`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/38fa27b)),
came from using the site rather than reading its diff. The 390px screenshots
looked broken and were not; headless Chrome will not go below about 500px on
Windows, so I measured `scrollWidth` against `clientWidth` in a real 390px
iframe across seven pages.

![The home page at 1440px](docs/home-1440.png)

![The home page at 390px](docs/home-390.png)
