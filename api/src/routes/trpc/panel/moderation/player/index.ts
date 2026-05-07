import db, { schema } from '@modules/db';
import { permsProcedure, router } from '@modules/trpc';
import { z } from 'zod';

export const playerModerationRouter = router({
	createWarn: permsProcedure
		.meta({
			permissionsRequired: ['VIEW_USERS', 'CREATE_WARNINGS']
		})
		.input(
			z.object({
				uuid: z.uuid(),
				reason: z.string().min(1).max(500),
				expiresAt: z.date().optional().default(new Date()),
				type: z.enum(['tempmajor', 'tempminor', 'major', 'minor'])
			})
		)
		.mutation(async ({ ctx, input }) => {
			const delay = input.expiresAt.getTime() - Date.now();

			const updatedWarn = await db
				.insert(schema.playerWarns)
				.values({
					victimId: input.uuid,
					authorId: ctx.user.id,
					reason: input.reason,
					type: input.type,
					expiresAt:
						input.type === 'tempmajor' || input.type === 'tempminor' ? input.expiresAt : new Date(),
					active: input.type === 'minor' || input.type === 'major' ? true : delay > 0
				})
				.returning();

			if (!updatedWarn[0]) {
				return {
					success: false,
					message: 'Failed to create warn.'
				};
			}

			return {
				success: !!updatedWarn[0],
				warn: updatedWarn[0],
				message: 'Warn created successfully'
			};
		}),
	createBan: permsProcedure
		.meta({
			permissionsRequired: ['VIEW_USERS', 'CREATE_BANS']
		})
		.input(
			z.object({
				uuid: z.uuid(),
				reason: z.string().min(1).max(500),
				permanent: z.boolean().default(false),
				expiresAt: z.date().optional().default(new Date())
			})
		)
		.mutation(async ({ input, ctx }) => {
			const delay = input.expiresAt.getTime() - Date.now();

			const newBan = await db
				.insert(schema.playerBans)
				.values({
					victimId: input.uuid,
					authorId: ctx.user.id,
					reason: input.reason,
					type: input.permanent ? 'permanent' : 'temporary',
					expiresAt: input.permanent ? new Date() : input.expiresAt,
					active: input.permanent ? true : delay > 0
				})
				.returning();

			if (!newBan[0]) {
				return {
					success: false,
					message: 'Failed to create ban.'
				};
			}

			return {
				success: !!newBan[0],
				ban: newBan[0],
				message: 'Ban created successfully'
			};
		})
});
