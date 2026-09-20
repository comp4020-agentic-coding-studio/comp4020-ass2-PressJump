// Who said a thing on the forum, resolved once for both forum pages.
//
// A post names either a display name (a student, who has no page on this
// site) or a person slug (staff, who do). Staff names and role badges are
// looked up in the people collection rather than typed into the post, so a
// badge cannot go on claiming somebody is the convenor after they stop being
// one, and a post cannot credit a member of staff who is not on the site.
import { getPublishedCollection } from "astro-course-university/content";

export interface Poster {
  name: string;
  /** Present only for staff. Rendered as a badge. */
  role?: string;
  /** Present only for staff, who have a profile to link to. */
  href?: string;
}

export interface Post {
  author?: string;
  person?: string;
}

/** Resolves once; both pages share the lookup. */
export async function posterLookup(): Promise<(post: Post) => Poster> {
  const people = await getPublishedCollection("people");
  const byId = new Map(people.map((person) => [person.id, person]));

  return (post: Post): Poster => {
    if (!post.person) {
      // A student. No profile, no badge, just a name.
      return { name: post.author ?? "Anonymous" };
    }
    const person = byId.get(post.person);
    if (!person) {
      // Loud rather than quiet. A post credited to a member of staff who is
      // not on the people page would otherwise render as a blank name with a
      // blank badge, which looks like a styling bug rather than a broken ref.
      throw new Error(
        `forum: a post names person "${post.person}", who is not in the people collection`,
      );
    }
    return {
      name: person.data.title,
      role: person.data.role,
      href: `/people/${person.id}/`,
    };
  };
}

/** The day a post was made, in the course's own calendar rather than yours. */
export const postDate = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Australia/Canberra",
});

/** When the thread last moved, which is what a forum list sorts on. */
export function lastActivity(thread: {
  data: { date: Date; replies: { date: Date }[] };
}): Date {
  return thread.data.replies.reduce(
    (latest, reply) => (reply.date > latest ? reply.date : latest),
    thread.data.date,
  );
}
