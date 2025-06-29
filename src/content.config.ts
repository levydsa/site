import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/blog' }),
  schema: z.object({
    title: z.string(),
  }),
});

// Expose your defined collection to Astro
// with the `collections` export
export const collections = { blog };