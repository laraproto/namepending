import { z } from 'zod';
import { jointFlagKeys } from '@namepending/shared/user';

export const serverFormSchema = z.object({
	description: z.string().max(255)
});

export const gameGroupFormSchema = z.object({
	name: z.string().max(50),
	description: z.string().max(255),
	permissions: z.array(z.string())
});

export const panelGroupFormSchema = z.object({
	name: z.string().max(50),
	description: z.string().max(255),
	permissions: z.array(jointFlagKeys),
	gameGroup: z.uuid()
});
