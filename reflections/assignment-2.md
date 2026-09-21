# Assignment 2 reflection

## What was the breakthrough that moved the work forward?

When starting my assignment, I started by going through the Slop University site the repo came with [1] and the provided website
on the assignment spec. Looking at it, the structure of the website was there like
sessions, assessments and people which is standard. Then I thought to myself,
if I were to add features to this website, what are pages and information
I would want as a student if I were attending this course. I came up with some solid
ideas like a proper calendar, extensions, and forums which were key missing components
I use in my studies as a student which pushed work forward where I added a semester
timetable with a calendar you can page through [2], an extension request form
that confirms in the page [3], a glossary, and a course forum laid out like one
people use [4]
([`d1c549e`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/d1c549e)).

![The forum index, topics on the left, replies and last reply on the right](../images/forum-index.png)

While I was adding these new pages I noticed the nav got quite long, so I grouped it into named collapsible
menus, letting several pages sit under one topic instead of one long row
([`714c353`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/714c353)) and I put each
page into groups of what they were related to like "assessments".

I also wanted the site to show things rather than only say them as students learn
the best through interactive learning and Assignment 1
taught me to let a reader work something out rather than read about it, so
instead of explaining Little's Law [5] I built the home page
around a calculator the student drives. Around it I added components for tables,
callouts, pull quotes and a weight bar
([`3b46ab0`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/3b46ab0)).
The calculator lets a student try the idea on a queue they know, and the blocks
around it carry what is better shown than described.

In developing all these additions I tested the application to make sure
everything worked, and testing it myself is how I found many bugs
that the agent could not detect. For example, the navigation was missing on
every page I reached by clicking a link, but it came back if I reloaded said
page.
After a good amount of debugging, apparently the theme had Astro's
`<ClientRouter>` [6] turned on, so a link click swaps the document in place
instead of reloading the page, and Astro runs a module script once per URL.
Anything set up at parse time ran on the first load and never again.
That left five things dead, the nav grouping, the calendar paging, the
calculator and both forms
([`63961a9`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/63961a9)).
The fix bound every script to `astro:page-load` and made setup idempotent,
because that event fires on first load too. Even though this bug
literally existed and the agent was looking at the page, every check stayed green,
because the HTML that ships is identical either way, which is why nothing
automated could catch it and the agent running could not detect what was
wrong.

## What did this work change about who I want to be as a software developer?

This assignment changed my perspective in a way where I used to treat software
as something you build and verify, and now as something you stand inside as the
person using it. Putting yourself in your user's shoes is the part no tool
does for you, and three habits came out of learning that.

First, I want to review an agent's work by using it rather than reading the
diff, since every defect I found here I found by clicking, and there were bugs
the agent could not detect, which showed me the importance of manual
testing even if tests pass green on a UI.

Second, I want to push back on writing that sounds impressive and says nothing,
because AI can write a lot of slop that adds up to nothing
([`38fa27b`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-PressJump/commit/38fa27b)).

![The rewritten brief, with numbered steps and the calls to settle first](../images/brief-steps.png)

Third, the simpler something is to see, the better it is understood. A table or
a callout does more for a reader than another paragraph, because it hands over
the shape before a word is read. Four assessment
weights drawn as a bar are read at a glance, where the same four numbers in a
sentence must be held in the head and added up. A marking table says where the
marks are without hunting, and a date in a calendar cell is easier to trust
than the same date buried in prose. Writing more is cheap and moves the work of
understanding onto the reader, so I would rather build the thing
that shows it.

Testing the site as the student it was for changed me as a developer, because
now I will click through what I build
before trusting it, cut writing that says nothing, and reach for interactive UI
that lets a user control their learning and visualise the point.

## References

1. [Slop University](https://slop.university/), the starter university.
2. [Semester timetable](https://comp4020-agentic-coding-studio.github.io/comp4020-ass2-PressJump/timetable/).
3. [Extension request](https://comp4020-agentic-coding-studio.github.io/comp4020-ass2-PressJump/extensions/).
4. [Course forum](https://comp4020-agentic-coding-studio.github.io/comp4020-ass2-PressJump/forum/).
5. Little, J. D. C. (1961). [A Proof for the Queuing Formula: L =
   λW](https://doi.org/10.1287/opre.9.3.383). *Operations Research*, 9(3),
   383-387.
6. [View transitions](https://docs.astro.build/en/guides/view-transitions/),
   Astro documentation.
