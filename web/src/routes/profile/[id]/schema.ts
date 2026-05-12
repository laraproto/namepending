import { z } from 'zod';

export const updateRoleSchema = z.object({
	role: z.string()
});

export type UpdateRoleSchema = typeof updateRoleSchema;
