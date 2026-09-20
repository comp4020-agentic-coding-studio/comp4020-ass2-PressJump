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

Halfway. Weeks 2 to 4 were about how much waiting there is. From here the
question is how it gets shared out, and this is the week the course stops
being arithmetic.

Priority is the most powerful lever in queueing and the most dangerous. Serve
the short jobs first and the average wait across everybody drops, sometimes
enormously. The arithmetic is unambiguous and it is used to justify a great
deal.

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

Fast passes, priority boarding, expedited processing, the premium support
queue. The seat you paid for is not a faster server. It is a place further
forward, and the arithmetic says exactly how much slower everybody behind you
got.

We do that arithmetic on the board for a real airline boarding scheme. The
number is smaller than most students expect, and the fact that it is small is
itself an argument worth having.

## After this lecture

You can take a queue you use, name its discipline, and compute who is paying
for the people in front.
