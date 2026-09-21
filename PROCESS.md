# Process

**The position came before the topic.** Reading Calling Bullshit, How to Make
(Almost) Anything and CS 007, what they share is not subject or register: each
is one claim held for a semester rather than a survey with a reading list. So
before any content I wrote four positions into `CLAUDE.md` and, against each,
whether I would enforce it or carry it myself
([`610a4a6`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/610a4a6)).

**The topic was not mine, and keeping it was.** While I was away from the
session the agent picked queues and wrote the course down
([`7b02fab`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/7b02fab)).
I came back, asked whether the subject had been set for us, and was offered a
rewrite on a different one. I kept it, because the sentence it had landed on,
that every queue is a decision about whose time counts for less, is a better
claim than the one I would have argued myself into and narrow enough to hold
twelve weeks. Accepting somebody else's topic on purpose is still a decision,
and every page since is tested against that sentence.

**What I encoded.** Position three, assessment is the curriculum, is the call I
would defend hardest. The four briefs were written before any lecture
([`cd448b4`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/cd448b4)),
so the weeks exist to make them possible. The
check that protects it is `needs:`
([`5cbb4a9`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/5cbb4a9)).
Every assessment names the lectures it cannot be attempted without, and the
test fails if any is taught on or after the due date. The obvious check was
weights summing to 100. I wrote that too, but it is arithmetic I would notice,
and `needs:` catches what I would not. Drag one lecture a fortnight later and
the build stays green while the course asks for work it has not taught.

**What I left out.** That every week must add a capability is the position I
care most about and there is no honest test for it, so `CLAUDE.md` says the
judgement half is mine. Writing every session to a fixed shape did more work
than any test would have. A Bring heading and a What leaves the room heading killed three sessions I had
drafted, because "the ethics of priority" had nothing to bring and nothing
leaving the room, which told me it was a lecture wearing a different label
([`e1ca8be`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/e1ca8be)).

**The call I nearly got wrong.** My em dash check went red on the platform
rather than on my prose, since the theme builds every document title with one
and the theme is fixed. The tempting fix was demoting it to a warning. I moved
its scope instead, because a check that fails on something I am not allowed to
change only ever teaches me to weaken it
([`429508d`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/429508d)).

**How I knew it was right.** I planted four bugs and watched each fail the right
test: week 11 dragged past The Redesign's deadline, a weight moved from 20 to
25, a Bring heading renamed, one em dash. Then the things no test caught.
Reading the rendered pages found my opening paragraph restating the hero
([`eed1561`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/eed1561)),
and a run of jokes that had turned the site into a satire of a course rather
than a course, taken out in one pass
([`e1e0b67`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/e1e0b67)).
The worst one only clicking found. The nav was missing on every page reached by
a link and present on every page reloaded, because `<ClientRouter>` swaps the
document and a parse-time script never re-runs
([`63961a9`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/63961a9)).
Every check stayed green, since the shipped HTML is identical either way, which
is why the later rebuilds, the forum
([`d1c549e`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/d1c549e))
and the assessment briefs
([`38fa27b`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/38fa27b)),
came from using the site rather than reading its diff.

![The home page at 1440px](docs/home-1440.png)

![The home page at 390px](docs/home-390.png)
