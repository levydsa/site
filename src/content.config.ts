import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    draft: z.optional(z.boolean()),
  }),
});

// Expose your defined collection to Astro
// with the `collections` export
export const collections = { blog };
