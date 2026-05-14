import { z } from 'zod';

export const serverFormSchema = z.object({
	description: z.string().max(255)
});
