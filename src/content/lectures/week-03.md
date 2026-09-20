---
title: Variability is the tax
description:
  A counter running at ninety-five percent of capacity is not a well-run
  counter. It is one bad morning from collapse.
week: 3
date: 2027-03-08
teachers:
  - amos-redfern
related:
  - assessments/the-measured-queue
  - week-04
---

Week 2 gave you averages. This week is about why averages are not enough, and
it is the week most likely to change how you look at a workplace.

Two counters serve the same number of customers an hour. At one of them the
wait is ninety seconds. At the other it is eleven minutes. Nothing about the
average explains it. What explains it is that the second counter's customers
arrive in clumps and take wildly different amounts of time, and a queue
punishes both.

The punishment is not linear, which is the part that surprises people. Push a
system from eighty percent utilisation to ninety and the wait does not go up
by an eighth. It roughly doubles. Push it to ninety-five and it doubles again.
Every organisation that has ever been told to sweat its assets has walked into
this, and most of them concluded they had a staff problem.

## Kingman's formula

An approximation, not an identity, and the most quietly devastating thing in
the course. Waiting time scales with a utilisation term that goes to infinity
as you approach full capacity, multiplied by a variability term.

Three consequences we work through on the board.

- Spare capacity is not waste. It is what you are buying instead of a queue.
- Reducing variability is usually cheaper than adding servers, and almost
  nobody tries it first.
- A system with no variability can run at ninety-nine percent forever. This is
  why a production line and a walk-in clinic are different animals.

## The honest caveat

Kingman is an approximation for a single queue with one server, and we will
spend ten minutes on where it stops being trustworthy. You are allowed to use
it in The Measured Queue. You are not allowed to use it without saying you
know it is an approximation.

## After this lecture

You can explain why the queue got worse after the efficiency drive.
