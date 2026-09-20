---
title: Little's Law
description:
  You can work out how long people are waiting without timing a single one of
  them.
week: 2
date: 2027-03-01
teachers:
  - amos-redfern
slides: /decks/week-02/
related:
  - assessments/the-measured-queue
---

The single most useful thing in this course, and the only equation you will be
required to reach for without warning.

The length of a queue equals the rate people arrive multiplied by the time
each of them spends in it. Written down it is almost insultingly simple. In
practice it means you can stand at a distance, count heads, count arrivals for
five minutes, and tell a manager how long their customers are waiting without
ever having followed one.

It holds for any stable system. It does not care what order you serve people
in, how many servers you have, how the arrivals are distributed, or whether
the thing in the queue is a person, a packet, a claim form or a kidney. That
generality is the reason it is worth an hour, and the reason people distrust
it when they first meet it.

## What it actually claims

L equals lambda W. Average number in the system, average arrival rate, average
time in the system.

The word doing the work is average. Little's Law is a statement about the long
run of a system that is not filling up and not draining. Point it at a queue
that is growing without bound and it will tell you something true and useless.

## The three ways it goes wrong

We spend the second half on failures, because you will hit all three in week 5.

- The system is not stable, and the average you computed is a snapshot of a
  backlog.
- Your boundary is wrong. People who balked, reneged or were served out of
  sight are in one of your counts and not the other.
- You measured arrivals during a rush and residence time during a lull.

## After this lecture

You can put a number on a wait you never timed. That is the whole of the field
session on Wednesday and most of The Measured Queue.
