import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { courseNodeSchema } from "astro-course-university/schemas";

const weekSchema = z.coerce.number().int().min(1).max(12);
const courseNodeLoader = (dir: string) =>
  glob({ pattern: ["**/*.{md,mdx}", "!**/CLAUDE.md"], base: `src/content/${dir}` });
const teacherRefs = z.array(reference("people")).min(1);

const weightedMarking = z
  .object({
    mode: z.literal("weighted"),
    criteria: z
      .array(z.object({ name: z.string().trim().min(1), weight: z.number().positive() }))
      .min(1),
  })
  .superRefine((marking, ctx) => {
    const total = marking.criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
    if (total !== 100) {
      ctx.addIssue({
        code: "custom",
        path: ["criteria"],
        message: `criterion weights sum to ${total}, not 100`,
      });
    }
  });

const holisticMarking = z.object({
  mode: z.literal("holistic"),
  description: z.string().trim().min(40),
});

export const collections = {
  sessions: defineCollection({
    loader: courseNodeLoader("sessions"),
    schema: courseNodeSchema
      .extend({
        week: weekSchema,
        date: z.coerce.date(),
        teachers: teacherRefs.optional(),
      })
      .loose(),
  }),

  assessments: defineCollection({
    loader: courseNodeLoader("assessments"),
    schema: courseNodeSchema
      .extend({
        week: weekSchema,
        due: z.coerce.date(),
        weight: z.coerce.number().positive().max(100),
        marking: z.discriminatedUnion("mode", [weightedMarking, holisticMarking]).optional(),

        // How lateness works for this piece. Declared here so the policies
        // page, the assessment page and the extension request form all read
        // one source instead of three copies that drift.
        //   standard - the ordinary per-day penalty
        //   none     - not accepted late at all
        //   event    - happens in a room at a time, so it cannot be handed in
        lateness: z.enum(["standard", "none", "event"]).default("standard"),
        latenessNote: z.string().trim().min(1).optional(),
      })
      .loose(),
  }),

  lectures: defineCollection({
    loader: courseNodeLoader("lectures"),
    schema: courseNodeSchema
      .extend({
        week: weekSchema,
        date: z.coerce.date(),
        teachers: teacherRefs.optional(),
        slides: z
          .string()
          .regex(/^\/decks\/[a-z0-9-]+\/$/)
          .optional(),
      })
      .loose(),
  }),

  // The three graph collections above are `.loose()`, so an invented key rides
  // through into the API. This one is a plain object, which strips what it does
  // not declare, so a staff profile needs its fields declared here or they
  // vanish silently between the markdown and the page. Everything added below
  // is optional and nothing shipped was removed.
  people: defineCollection({
    loader: courseNodeLoader("people"),
    schema: ({ image }) =>
      z
        .object({
          title: z.string().trim().min(1),
          description: z.string().trim().min(40),
          role: z.string().trim().min(1),
          contact: z.string().trim().min(1).optional(),
          affiliation: z.string().trim().min(1).optional(),
          email: z.email().optional(),
          url: z.url().optional(),
          photo: image().optional(),
          photoAlt: z.string().trim().optional(),
          published: z.coerce.boolean().default(true),

          // Where a student physically finds this person, and when.
          office: z.string().trim().min(1).optional(),
          phone: z.string().trim().min(1).optional(),
          consultation: z.string().trim().min(1).optional(),
          joined: z.number().int().min(1950).max(2200).optional(),

          // Profiles elsewhere. Not `links`, which the course API reserves.
          profiles: z
            .array(
              z.object({
                label: z.string().trim().min(1),
                href: z.string().trim().min(1),
              }),
            )
            .optional(),

          interests: z.array(z.string().trim().min(2)).max(8).optional(),

          awards: z
            .array(
              z.object({
                year: z.number().int().min(1950).max(2200),
                title: z.string().trim().min(1),
                body: z.string().trim().min(1).optional(),
              }),
            )
            .optional(),

          // Slop University is fictional and so is everything published in it.
          // `venue` is required so no entry can be mistaken for a real paper in
          // a real journal; see the note in CLAUDE.md about invented evidence.
          publications: z
            .array(
              z.object({
                year: z.number().int().min(1950).max(2200),
                title: z.string().trim().min(1),
                venue: z.string().trim().min(1),
              }),
            )
            .optional(),
        })
        .superRefine((person, ctx) => {
          if (person.photo && !person.photoAlt) {
            ctx.addIssue({
              code: "custom",
              path: ["photoAlt"],
              message: "describe the photo when one is supplied",
            });
          }
        }),
  }),
};
