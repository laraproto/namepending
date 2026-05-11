import { z } from 'zod';

export const updateRoleSchema = z.object({
	role: z.uuid()
});

export type UpdateRoleSchema = typeof updateRoleSchema;
