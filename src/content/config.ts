import { defineCollection, z } from 'astro:content';

const baseSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.string(), // ISO
  lang: z.enum(['ko','en']),
  tags: z.array(z.string()).optional(),
  cover: z.string().optional(),
  canonical: z.string().optional(),
  hreflang: z.array(z.object({ lang: z.enum(['ko','en']), url: z.string() })).optional(),
  sources: z.array(z.object({ name: z.string(), url: z.string() })).optional(),
  affiliate_links: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
  disclosure: z.string().optional(),
});

export const ko = defineCollection({ type: 'content', schema: baseSchema.extend({ lang: z.literal('ko') })});
export const en = defineCollection({ type: 'content', schema: baseSchema.extend({ lang: z.literal('en') })});

export const collections = { ko, en };
