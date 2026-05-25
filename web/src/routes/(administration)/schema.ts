import { z } from 'zod';
import { jointFlagKeys } from '@namepending/shared/user';
import { permissionSchema } from '@namepending/shared/sl';

export const serverFormSchema = z.object({
	description: z.string().max(255)
});

export const gameGroupFormSchema = z.object({
	id: z.uuid().optional(),
	name: z.string().max(50),
	description: z.string().max(255),
	permissions: z.array(permissionSchema)
});

export const panelGroupFormSchema = z.object({
	id: z.uuid().optional(),
	name: z.string().max(50),
	description: z.string().max(255),
	permissions: z.array(jointFlagKeys),
	gameGroup: z.uuid()
});

export type GameGroupFormSchema = typeof gameGroupFormSchema;
export type PanelGroupFormSchema = typeof panelGroupFormSchema;
export type ServerFormSchema = typeof serverFormSchema;
