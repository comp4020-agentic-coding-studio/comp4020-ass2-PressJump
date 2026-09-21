# Process

**The position came before the topic.** I read Calling Bullshit, How to Make
(Almost) Anything and CS 007 looking for what they share. It is not subject or
register. Each is one claim held for a semester rather than a survey with a
reading list attached. So before any content I wrote four positions into
`CLAUDE.md` and, against each, whether I would enforce it or carry it myself
([`a00a20b`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/a00a20b)).
The sentence at the top of that file, that every queue is a decision about whose
time counts for less, is what the agent tests every paragraph against.

**What I encoded.** Position three, assessment is the curriculum, is the
sequencing call I would defend hardest. The four briefs were written before any
lecture
([`42afe72`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/42afe72)),
so the weeks exist to make them possible rather than the other way round. The
check that protects it is `needs:`
([`9ef8338`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/9ef8338)).
Every assessment names the lectures whose methods it cannot be attempted
without; the test resolves the refs and fails if any of them is taught on or
after the due date. The obvious check was weights summing to 100. I wrote that
too, but it is arithmetic I would notice. `needs:` catches what I would not. It
is not a schema key, so the build never looks at it. Drag one lecture a
fortnight later and the build stays green while the course asks for work it has
not taught.

**What I left out.** That every week must add a capability is the position I
care most about and there is no honest test for it. `spec/course-shape.test.ts`
enforces only the scaffolding, twelve weeks with one lecture and one field
session each, on the dates the course record implies, no two titles alike, and
`CLAUDE.md` says the judgement half is mine. Writing every session to a fixed
shape did more work than any test. A Bring heading and a What leaves the room
heading killed three sessions I had drafted, because "the ethics of priority"
had nothing to bring and nothing leaving the room, which told me it was a
lecture wearing a different label
([`9ac6a56`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/9ac6a56)).

**The call I nearly got wrong.** My em dash check went red on the platform
rather than on my prose: the theme builds every document title with one in it,
and the theme is fixed. The tempting fix was demoting the rule to a
warning. I moved its scope instead, so it reads the body and not the head, since
a check that fails on something I am not allowed to change only ever teaches me
to weaken it
([`f442e04`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/f442e04)).
The same commit fixed the real offender, which was my own component. I also
dropped the blanket colon ban I carried from C5; the tell was never the colon.

**How I knew it was right.** I planted four bugs and watched each fail the right
test: week 11 dragged past The Redesign's deadline, a weight moved from 20 to
25, a Bring heading renamed, one em dash. Then the things no test caught. The
build's axe pass complained about one page. Rather than delete it I went
looking, and found four `.mdx` pages shipping with no `<html lang>`, no
`<title>` and no navigation
([`99c70b1`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/99c70b1)).
Last, reading the rendered pages, I found my opening paragraph restating the
description the hero already prints
([`f131fbf`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/f131fbf)).
The 390px screenshots looked broken and were not; Chrome's headless mode will
not make a window narrower than about 500px on Windows, so it crops rather than
reflows. I measured `scrollWidth` against `clientWidth` in a real 390px iframe
across seven pages instead.

![The home page at 1440px](docs/home-1440.png)

![The home page at 390px](docs/home-390.png)
