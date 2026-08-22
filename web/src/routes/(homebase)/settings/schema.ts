import { z } from 'zod';

export const linkSchema = z.object({
	code: z.string().min(1).max(48)
});

export type LinkSchema = typeof linkSchema;
