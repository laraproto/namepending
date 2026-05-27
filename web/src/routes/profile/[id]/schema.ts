import { z } from 'zod';

export const updateRoleSchema = z.object({
	role: z.string().optional()
});

export type UpdateRoleSchema = typeof updateRoleSchema;
