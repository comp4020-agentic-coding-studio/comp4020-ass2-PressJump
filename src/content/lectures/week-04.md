---
title: One line or many
description:
  The banks changed to a single serpentine line and the supermarkets never
  did. Both were right.
week: 4
date: 2027-03-15
teachers:
  - amos-redfern
related:
  - assessments/the-redesign
---

The first structural decision anybody makes about a queue. Five counters with
five lines, or five counters with one line feeding all of them.

Pooling wins on the arithmetic and it wins by a lot. One line into five
servers is dramatically better than five separate lines, not because the
servers go faster but because nobody is ever idle while somebody else is
waiting. The unlucky customer stuck behind a difficult transaction no longer
pays for it alone.

So why does a supermarket still have you choosing a till. That is the
interesting half of the hour, and the answer is not that supermarkets are
badly run.

## The arithmetic

We compare two systems formally. Several independent single-server queues
against one queue feeding several servers, at the same total capacity.

The pooled system wins on mean wait at every load, and the gap widens as you
approach capacity. It also wins on fairness in a way we can define precisely,
because the variance of the wait collapses. Nobody has a catastrophic day.

## The reasons not to pool

Five of them, and you need all five for the redesign.

- Space. A serpentine line for twelve tills is a building you do not have.
- Impulse purchase. The supermarket is selling you the wait.
- Perceived progress. One long line looks worse than four short ones even
  when it is faster, and week 8 is about what that costs.
- Specialisation. Pooling assumes any server can serve any customer.
- The balk. A single visible line of thirty people turns customers away in a
  way four lines of eight do not.

## After this lecture

You can say which of these applies at your own site, and that is the first
half of The Redesign.
