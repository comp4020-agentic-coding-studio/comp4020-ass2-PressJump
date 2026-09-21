---
title: The long tail
description:
  Plotting your own service times and discovering that the average was hiding
  most of what matters.
week: 3
date: 2027-03-10
teachers:
  - priya-raghunathan
  - amos-redfern
related:
  - lectures/week-03
  - assessments/the-measured-queue
spec:
  - you plot a histogram of at least 60 service times from your own queue
  - you compute the coefficient of variation
  - you can say whether your queue is closer to a production line or a clinic
---

By now you should have a mean service time of your own. This session is about
how remarkably little that one number tells you, and we work it through using
your data rather than a textbook's, which tends to make the point land
harder.

## What happens

**First half hour, hands on paper.** Everybody plots their own service times
as a histogram, by hand, on graph paper. Doing it by hand is deliberate. A
plotting library will draw you something smooth and you will not look at it.

**Next half hour.** We put them all on the wall in a row. Twenty histograms
from twenty queues is the fastest way to see that service time distributions
are not all one shape, and some of them are nothing like the bell curve people
expect.

**Last hour.** The coefficient of variation, computed for your own queue, and
then Kingman applied to your own numbers. Most people get a predicted wait
that is wrong. We spend the rest of the session on why, and the reasons are
interesting.

## The thing to watch for

Watch for a queue with a bimodal service time. A counter that does two
different jobs, one taking forty seconds and the other six minutes, produces a
mean that nobody standing in it has ever experienced. If your histogram has two humps you have found the single best
thing to write about in The Measured Queue.

## Bring

- Your observation sheets, with at least sixty service times on them. If you
  do not have sixty, come anyway and use somebody else's while you arrange to
  collect more.
- A calculator or a laptop. Either is fine here.
- Graph paper is provided.

## What leaves the room

A hand-drawn histogram of your queue's service times, a coefficient of
variation, and a Kingman estimate of your mean wait with a note on how far it
is from what you measured.
