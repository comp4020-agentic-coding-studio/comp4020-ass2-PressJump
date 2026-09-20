---
title: Little's Law says forty minutes and that is obviously wrong
description: A count of twelve and an arrival rate of one every three minutes gives a wait nobody in the line is actually experiencing.
category: Arithmetic
week: 2
date: 2027-03-03
author: Bea Lindqvist
views: 507
replies:
  - person: amos-redfern
    week: 2
    date: 2027-03-03
    body: >-
      Your arithmetic is right and your boundary is wrong, which is failure
      number two from Monday. You counted twelve people in the queue, and then
      counted arrivals at the door. Some of those twelve did not come through
      the door in the window you were watching, and some of the people who
      came through the door went straight to a shelf without joining.
      Draw the box first, then count only what crosses it.
    answer: true
  - author: Bea Lindqvist
    week: 2
    date: 2027-03-04
    body: >-
      That is exactly it. I was counting the room and timing the door. Redid
      it with the box drawn at the end of the line and got eleven minutes,
      which matches what I get if I just follow somebody with a stopwatch.
  - person: amos-redfern
    week: 2
    date: 2027-03-04
    body: >-
      Good. Keep the eleven and keep the forty. The gap between a wrong answer
      and a right one is the most useful paragraph you will write in The
      Measured Queue, and almost nobody includes it.
  - author: Tomas Rehak
    week: 2
    date: 2027-03-05
    body: >-
      Filing this for later because I am about to make the same mistake at a
      bus stop where the queue and the shelter are different shapes.
---

Coffee place on the ground floor. I counted twelve people in the queue and
watched the door for fifteen minutes and got five arrivals, so about one every
three minutes.

L over lambda gives twelve times three, which is thirty six minutes, call it
forty. Nobody in that queue is waiting forty minutes. I stood in it myself on
Friday and it took under ten.

What am I doing wrong? The equation is two variables and I have measured both
of them.
