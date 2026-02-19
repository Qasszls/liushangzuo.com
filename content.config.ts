import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        updated: z.string().optional(),
        tags: z.array(z.string()).default([]),
        cover: z.string().optional(),
        draft: z.boolean().default(false),
        featured: z.boolean().default(false),
        readingTime: z.number().optional(),
      }),
    }),
    works: defineCollection({
      type: 'page',
      source: 'works/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        category: z.enum(['风光', '人文', '街头', '建筑']),
        series: z.string().optional(),
        image: z.string(),
        camera: z.string().optional(),
        lens: z.string().optional(),
        settings: z.object({
          aperture: z.string(),
          shutter: z.string(),
          iso: z.number(),
        }).optional(),
        location: z.string().optional(),
        featured: z.boolean().default(false),
      }),
    }),
  },
})
