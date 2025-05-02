import { z } from 'zod';

export const NoteSchema = z.object({
    id: z.string(),
    userId: z.number().nullish(),
    lastUpdatedTime: z.string(),
    name: z.string(),
    source: z.string(),
});

export const NoteStrictSchema = NoteSchema.omit({ userId: true }).extend({
    userId: z.string(),
});
