import db, { schema } from '$lib/server/db';
import { permsProcedure, router } from '$lib/server/trpc';
import { count, desc } from 'drizzle-orm';
import { z } from 'zod';

export const playerModerationRouter = router({
	getWarns: permsProcedure
		.meta({
			permissionsRequired: ['VIEW_USERS', 'VIEW_WARNINGS']
		})
		.input(
			z.object({
				uuid: z.uuid(),
				limit: z.int().min(1).max(100).default(10),
				page: z.int().min(1).default(1)
			})
		)
		.query(async ({ input }) => {
			try {
				const rowQuery = await db.select({ value: count() }).from(schema.playerWarns);
				let totalWarnings = 0;

				if (rowQuery[0]) {
					totalWarnings = Number(rowQuery[0].value);
				}

				const pageCount = Math.max(1, Math.ceil(totalWarnings / input.limit));

				if (input.page > pageCount) {
					input.page = pageCount;
				}
				const warn = await db.query.playerWarns.findMany({
					orderBy: [desc(schema.playerWarns.createdAt)],
					limit: input.limit,
					offset: (input.page - 1) * input.limit,
					with: {
						warnVictim: {
							columns: {
								name: true,
								platformId: true,
								uuid: true
							}
						},
						warnAuthor: {
							columns: {
								name: true,
								id: true
							}
						}
					},
					where: (warn, { eq }) => eq(warn.victimId, input.uuid)
				});

				return {
					data: warn,
					count: totalWarnings,
					pageCount
				};
			} catch (err) {
				console.error(err);
				return {
					data: [],
					count: 0,
					pageCount: 1
				};
			}
		}),
	getBans: permsProcedure
		.meta({
			permissionsRequired: ['VIEW_USERS', 'VIEW_BANS']
		})
		.input(
			z.object({
				uuid: z.uuid(),
				limit: z.int().min(1).max(100).default(10),
				page: z.int().min(1).default(1)
			})
		)
		.query(async ({ input }) => {
			try {
				const rowQuery = await db.select({ value: count() }).from(schema.playerBans);
				let totalBans = 0;

				if (rowQuery[0]) {
					totalBans = Number(rowQuery[0].value);
				}

				const pageCount = Math.max(1, Math.ceil(totalBans / input.limit));

				if (input.page > pageCount) {
					input.page = pageCount;
				}
				const ban = await db.query.playerBans.findMany({
					orderBy: [desc(schema.playerBans.createdAt)],
					limit: input.limit,
					offset: (input.page - 1) * input.limit,
					with: {
						banVictim: {
							columns: {
								name: true,
								platformId: true,
								uuid: true
							}
						},
						banAuthor: {
							columns: {
								name: true,
								id: true
							}
						}
					},
					where: (ban, { eq }) => eq(ban.victimId, input.uuid)
				});

				return {
					data: ban,
					count: totalBans,
					pageCount
				};
			} catch (err) {
				console.error(err);
				return {
					data: [],
					count: 0,
					pageCount: 1
				};
			}
		}),
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
			try {
				const delay = input.expiresAt.getTime() - Date.now();

				const updatedWarn = await db
					.insert(schema.playerWarns)
					.values({
						victimId: input.uuid,
						authorId: ctx.user.id,
						reason: input.reason,
						type: input.type,
						expiresAt:
							input.type === 'tempmajor' || input.type === 'tempminor'
								? input.expiresAt
								: new Date(),
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
			} catch (err) {
				console.error(err);
				return {
					success: false,
					message: 'An error occurred while creating the warn.'
				};
			}
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
			try {
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
			} catch (err) {
				console.error(err);
				return {
					success: false,
					message: 'An error occurred while creating the ban.'
				};
			}
		})
});
