import { z } from 'zod';
import { roleFlagKeys } from '@namepending/shared/user';
import { colorSchema, permissionSchema } from '@namepending/shared/sl';

export const serverFormSchema = z.object({
	description: z.string().max(255)
});

export const gameGroupFormSchema = z.object({
	id: z.uuid(),
	name: z.string().max(50),
	description: z.string().max(255),
	color: colorSchema.default('green'),
	permissions: z.array(permissionSchema)
});

export const panelGroupFormSchema = z.object({
	id: z.uuid(),
	name: z.string().max(50),
	description: z.string().max(255),
	permissions: z.array(roleFlagKeys),
	gameGroup: z.string().optional()
});

export type GameGroupFormSchema = typeof gameGroupFormSchema;
export type PanelGroupFormSchema = typeof panelGroupFormSchema;
export type ServerFormSchema = typeof serverFormSchema;
