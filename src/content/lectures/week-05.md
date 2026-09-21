---
title: Priority, and who pays for it
description:
  Every queue jump is paid for by somebody standing further back who was never
  told.
week: 5
date: 2027-03-22
teachers:
  - tessa-varga
related:
  - assessments/whose-time-it-was
---

This is the halfway point. Weeks 2 to 4 were about how much waiting a queue
produces, and from here the question becomes how that waiting gets shared out.
It is the week the course stops being arithmetic.

Priority is far and away the most powerful lever in queueing, and it is also
the most dangerous one. Serve the short jobs first and the average wait across
everybody drops, sometimes quite enormously. The arithmetic here is completely
unambiguous, which is precisely why it gets used to justify a great deal.

What the average hides is the tail. Shortest-job-first is optimal for the mean
and brutal for the long job, which can wait forever while short work keeps
arriving in front of it. Computing people call this starvation, which is a
good word, and it happens to people as readily as to processes.

## The disciplines, and who pays for each

| Discipline | What it optimises | Who pays for it |
|---|---|---|
| First-come-first-served | The variance of the wait, which is to say fairness | Everybody a little, nobody a lot |
| Shortest-job-first | The mean wait, sometimes enormously | The longest job, potentially forever |
| Priority classes | Whatever the classes were drawn around | Everybody outside the top class |
| Last-come-first-served | Nothing at all | Whoever arrived first |

The fourth one sounds absurd until you notice it is what a stack of paperwork
on a desk does by default. Nobody chooses it. It is what you get when nobody
chooses, and it is what happens to your claim form.

> First-come-first-served is the only discipline on that list that optimises
> for a property of the people in the queue rather than a property of the
> queue.

## Paid priority

Fast passes, priority boarding, expedited processing and the premium support
queue are all one mechanism wearing four names. The seat you paid for does not
buy you a faster server. It buys you a place further forward, and the
arithmetic will say exactly how much slower everybody behind you got.

We do that arithmetic on the board for a real airline boarding scheme. The
number is smaller than most students expect, and the fact that it is small is
itself an argument worth having.

## After this lecture

You can take a queue you use, name its discipline, and compute who is paying
for the people in front.
