---
title: The Measured Queue
description:
  Observe one real queue for at least 90 minutes and report its arrival rate,
  service rate, utilisation and mean wait, with the method behind each figure.
week: 5
due: 2027-03-26T17:00:00+11:00
weight: 25
needs:
  - lectures/week-01
  - lectures/week-02
  - lectures/week-03
marking:
  mode: weighted
  criteria:
    - name: Quality of the measurement
      weight: 45
    - name: Correct use of Little's Law and the variability term
      weight: 30
    - name: Honesty about what the numbers cannot tell you
      weight: 25
lateness: standard
related:
  - the-redesign
spec:
  - one queue, chosen in the week 1 field session and registered by 17:00 Friday of week 1, not changed after week 2
  - at least 90 minutes of observation, in blocks of 30 minutes or more, across two different days
  - arrival rate, service rate, utilisation and mean wait, each reported with its unit, its sample size and the method that produced it
  - one histogram of service times
  - a section naming one quantity you could not obtain, and why
  - a report of at most 1500 words as a PDF, plus the raw observation sheets as a separate file
---

## The task

> Measure one queue until you can state its arrival rate, service rate,
> utilisation and mean wait, and say how much confidence each of those four
> figures deserves.

This is the first of four pieces and it is worth 25 percent. It is also the
queue you keep for the rest of the semester: Whose Time It Was may use it, and
The Redesign must. Choose one you can physically reach on two separate days.

Suitable sites include a shop till, a service counter, a lift lobby, a coffee
cart, a help desk, a ticket barrier and a bus door. Queues you cannot stand
next to, such as phone lines and waiting lists, are covered in week 7 and are
not suitable here.

## Before you collect anything

1. **Register your queue by 17:00 Friday of week 1.** You choose it in the
   week 1 field session on the Wednesday; registering means posting the site,
   the service and your two planned observation days to Priya, who confirms it
   or suggests an alternative within two working days. Changing your queue
   after week 2 means starting the measurement again.
2. **Get permission if the site is private property.** Anything indoors with
   staff needs it. Priya has a one-paragraph email you can send; use it in
   week 1 rather than week 4.
3. **Write your definitions down before you collect data.** You need a written
   rule for what counts as an arrival, what counts as the start of service,
   and what counts as a departure. Fix these before you start and do not
   change them between sessions.
4. **Run a 15-minute pilot.** It exists to break your definitions while it
   still costs you nothing. The pilot does not count towards the 90 minutes.

Your definitions will have to settle at least these cases, and the report has
to state the rule you used for each:

| Case | What you have to decide |
| --- | --- |
| Someone leaves the line and comes back | Whether that is one arrival or two |
| Three people arrive, one of them orders | Whether the queue length is one or three |
| A second counter opens for 90 seconds | Whether that period is part of the same system |
| Someone looks at the line and walks away | Whether a departure without service is recorded at all |

## What to do

1. Observe the queue for at least 90 minutes in total, in blocks of no less
   than 30 minutes, across two different days. Record the clock time at the
   start and end of every block.
2. Record every event on a timestamped tally sheet. Paper is fine. A
   spreadsheet is fine. Counting from memory is not.
3. Time at least 30 complete services. If the queue is slow, extend the
   observation until you have them.
4. Compute the arrival rate, the service rate, the utilisation and the mean
   wait. Show the arithmetic for at least one of them in full.
5. Apply Little's Law and state which boundary you applied it to, the line
   alone or the line plus the person being served. The two give different
   answers and both are defensible if you say which one you used.
6. Plot the service times as a histogram, with the bin width stated.

## What to submit

Two files, through the assessment portal on this site, by 17:00 Friday of
week 5.

| File | Format | Naming |
| --- | --- | --- |
| The report | PDF | `SLOP3068-A1-u1234567.pdf` |
| The raw observation sheets | PDF or spreadsheet | `SLOP3068-A1-data-u1234567` |

The report is at most 1500 words. The title page, tables, figure captions,
reference list and the observation sheets do not count towards that. The
sheets are read, so scan or photograph them legibly if they are on paper.

Write for a reader who has taken this course. You do not need to explain
Little's Law or define utilisation.

## Report structure

Use these five sections, in this order, with these headings.

| Section | What it contains | Indicative words |
| --- | --- | --- |
| 1. The queue | The site, the service, why you chose it, and the dates and times you observed | 150 |
| 2. Definitions and method | Your written rules for arrival, service start and departure, the four cases above, your instrument, and your block structure | 300 |
| 3. Results | Arrival rate, service rate, utilisation and mean wait in one table, with units and sample sizes, plus the service time histogram | 400 |
| 4. Variability | Whether your service times are tightly grouped or widely spread, a spread statistic to support it, and what that does to the wait a customer actually experiences | 350 |
| 5. Limits | One quantity you wanted and could not obtain, why it was out of reach, and what it would have taken to get it | 200 |
| Appendix | The raw sheets, in the separate file | Not counted |

## Figures, tables and units

Number and caption every figure and table. Report every quantity with its
unit, the interval it was computed over and the number of observations behind
it. "4.2 arrivals per minute, over 40 minutes, n equals 168" is a result;
"about four a minute" is not.

## What each criterion means

The weights are in the table below this brief.

**Quality of the measurement.** Definitions written before collection, the
full 90 minutes across two days, sample sizes given for every mean, and
arithmetic a marker can reproduce from your appendix.

**Correct use of Little's Law and the variability term.** Consistent units, a
stated boundary, a stated assumption about steady state, and a spread
statistic rather than a mean on its own.

**Honesty about what the numbers cannot tell you.** Section 5 names one
specific quantity and explains the obstacle. A general statement that all
measurement has limitations does not earn these marks.

## Referencing, integrity and lateness

Author and date in the text, with a reference list at the end. There is no
minimum number of sources; this is a measurement report and the evidence is
your own data.

Your observations have to be yours. See the [academic integrity
section](/policies/) of the policies page, which also covers the use of
language models and the standard late penalty. If you need longer,
[ask for an extension](/extensions/) before the deadline.
