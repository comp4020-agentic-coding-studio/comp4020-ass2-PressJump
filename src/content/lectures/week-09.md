---
title: Machines that wait
description:
  Your laptop is running a dozen queues right now and its scheduler faces
  exactly the problem the passport office does.
week: 9
date: 2027-05-03
teachers:
  - amos-redfern
related:
  - assessments/the-redesign
---

The same object, in a system that keeps a complete log of itself.

A CPU scheduler is a priority queue serving jobs of wildly varying length
under unpredictable arrivals. So is a passport office. The difference is that
one of them records every arrival, every service and every wait to the
microsecond, and publishes its source code.

This is the week where everything from weeks 2 to 5 comes back with real data
attached. We take a scheduler trace and find Little's Law in it, and the
utilisation wall from week 3, and the starvation from week 5, sitting there in
the numbers.

## What computing knows that counter design does not

- Backpressure. When a queue fills, push the pressure back to whoever is
  producing work rather than absorbing it in a longer line. The polite
  equivalent at a counter is the sign that says come back tomorrow, and almost
  nobody puts one up.
- Bounded buffers. A queue with no maximum length is a queue that will
  eventually be useless to everybody in it.
- Admission control. Refusing work is a feature. Weeks 5 and 6 were about who
  gets refused.
- Ageing. Add priority to a job the longer it waits, and starvation goes away
  without giving up the benefits of shortest-job-first. This is the single
  most transferable idea in the course and hardly any human queue uses it.

## The direction of the lesson

It runs both ways. Schedulers have things to teach a service counter, and the
fairness arguments from week 5 apply just as sharply to the software that
decides which request gets dropped.

## After this lecture

You can read a trace, and you have ageing in your toolkit for The Redesign.
