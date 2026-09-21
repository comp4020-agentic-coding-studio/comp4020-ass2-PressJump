---
title: Reading a scheduler trace
description:
  Finding Little's Law, the utilisation wall and starvation in a real trace
  from a machine with nothing to hide.
week: 9
date: 2027-05-05
teachers:
  - amos-redfern
related:
  - lectures/week-09
  - assessments/the-redesign
spec:
  - you extract arrival rate, mean residence and queue length from a supplied trace
  - you verify Little's Law holds in the trace to within one percent
  - you find at least one starved job and say what ageing would have done to it
---

This is the one session with a keyboard in it, and it is the only place in the
whole course where you get a complete record of a queue rather than an
approximation of one. Make the most of it, because you will not see data this
clean again.

## What happens

**Twenty minutes.** The trace format. Every job, its arrival timestamp, its
start, its finish, its priority. Three hundred thousand rows from a real
scheduler under real load.

**Fifty minutes.** You compute the three quantities you have been estimating
by hand since week 2, except now they are exact. Then you check Little's Law
against them and watch it come out right to several decimal places, which is
more convincing than any proof.

**Fifty minutes.** The interesting half. Find the utilisation wall in the
trace by plotting wait against load and watching it bend. Then find a starved
job. There is always at least one and usually several, and the record shows
exactly how long it sat there and exactly what kept going in front of it.

Then you run the counterfactual. Apply ageing to the same trace, re-run it,
and the starved job finally gets served. Something else now waits longer in its
place, and your job is to say what.

## Why this is not a computing exercise

Because the ageing counterfactual is the same operation as adding a
long-waiter override to a human queue, and this is the only place you can run
it and see the consequence before you propose it in The Redesign.

## Bring

- A laptop that can run the course notebook. Any language is fine; the trace
  is a CSV and nothing in this session needs a library.
- If your laptop is unreliable, say so beforehand and a machine will be there.

## What leaves the room

You leave with the three quantities, a Little's Law check, one named starved
job, and a before and after under ageing that names who lost by it.
