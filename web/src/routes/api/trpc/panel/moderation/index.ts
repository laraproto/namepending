import db, { schema } from '$lib/server/db';
import { permsProcedure, router } from '$lib/server/trpc';
import { platformRegex } from '@namepending/shared/user';
import { count, desc, eq, inArray, or, ilike } from 'drizzle-orm';
import { z } from 'zod';
import { playerModerationRouter } from './player';

export const moderationRouter = router({
	player: playerModerationRouter,
	searchPlayer: permsProcedure
		.meta({
			permissionsRequired: 'SEARCH_USERS'
		})
		.input(
			z.object({
				query: z.string(),
				limit: z.int().min(1).max(100).default(10),
				page: z.int().min(1).default(1)
			})
		)
		.query(async ({ input }) => {
			const rowQuery = await db.select({ value: count() }).from(schema.player);
			let totalPlayers = 0;

			if (rowQuery[0]) {
				totalPlayers = Number(rowQuery[0].value);
			}

			const pageCount = Math.max(1, Math.ceil(totalPlayers / input.limit));

			if (input.page > pageCount) {
				input.page = pageCount;
			}
			switch (true) {
				case platformRegex.test(input.query): {
					const player = await db.query.player.findMany({
						orderBy: [desc(schema.player.createdAt)],
						where: (player, { eq }) => eq(player.platformId, input.query),
						limit: input.limit,
						offset: (input.page - 1) * input.limit
					});

					return {
						data: player,
						count: totalPlayers,
						pageCount
					};
				}
				case z.uuid().safeParse(input.query).success: {
					const player = await db.query.player.findMany({
						orderBy: [desc(schema.player.createdAt)],
						where: (player, { eq }) => eq(player.uuid, input.query),
						limit: input.limit,
						offset: (input.page - 1) * input.limit
					});

					return {
						data: player,
						count: totalPlayers,
						pageCount
					};
				}
				default: {
					const player = await db.query.player.findMany({
						orderBy: [desc(schema.player.createdAt)],
						where: (player, { ilike }) => ilike(player.name, `%${input.query}%`),
						limit: input.limit,
						offset: (input.page - 1) * input.limit
					});

					return {
						data: player,
						count: totalPlayers,
						pageCount
					};
				}
			}
		}),
	searchUser: permsProcedure
		.meta({
			permissionsRequired: 'SEARCH_USERS'
		})
		.input(
			z.object({
				query: z.string(),
				limit: z.int().min(1).max(100).default(10),
				page: z.int().min(1).default(1)
			})
		)
		.query(async ({ input }) => {
			const rowQuery = await db.select({ value: count() }).from(schema.user);
			let totalUsers = 0;

			if (rowQuery[0]) {
				totalUsers = Number(rowQuery[0].value);
			}

			const pageCount = Math.max(1, Math.ceil(totalUsers / input.limit));

			if (input.page > pageCount) {
				input.page = pageCount;
			}
			switch (true) {
				case platformRegex.test(input.query): {
					const user = await db.query.user.findMany({
						orderBy: [desc(schema.user.createdAt)],
						where: (user, { eq, inArray }) =>
							inArray(
								user.id,
								db
									.select({ id: schema.player.uuid })
									.from(schema.player)
									.where(eq(schema.player.platformId, input.query))
							),
						with: {
							group: true
						},
						limit: input.limit,
						offset: (input.page - 1) * input.limit
					});

					return {
						data: user,
						count: totalUsers,
						pageCount
					};
				}
				default: {
					const user = await db.query.user.findMany({
						orderBy: [desc(schema.user.createdAt)],
						where: (user, { ilike, or, eq }) =>
							or(ilike(user.name, `%${input.query}%`), eq(user.id, input.query)),
						with: {
							group: true
						},
						limit: input.limit,
						offset: (input.page - 1) * input.limit
					});

					return {
						data: user,
						count: totalUsers,
						pageCount
					};
				}
			}
		}),
	bans: permsProcedure
		.meta({
			permissionsRequired: 'VIEW_BANS'
		})
		.input(
			z.object({
				query: z.string(),
				limit: z.int().min(1).max(100).default(10),
				page: z.int().min(1).default(1)
			})
		)
		.query(async ({ input }) => {
			switch (true) {
				case platformRegex.test(input.query): {
					const ban = await db.query.playerBans.findMany({
						orderBy: [desc(schema.playerBans.createdAt)],
						limit: input.limit,
						offset: (input.page - 1) * input.limit,
						where: (ban, { inArray, eq }) =>
							inArray(
								ban.victimId,
								db
									.select({ id: schema.player.uuid })
									.from(schema.player)
									.where(eq(schema.player.platformId, input.query))
							),
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
						}
					});

					const rowQuery = await db
						.select({ value: count() })
						.from(schema.playerBans)
						.where(
							inArray(
								schema.playerBans.victimId,
								db
									.select({ id: schema.player.uuid })
									.from(schema.player)
									.where(eq(schema.player.platformId, input.query))
							)
						);
					let totalBans = 0;

					if (rowQuery[0]) {
						totalBans = Number(rowQuery[0].value);
					}

					const pageCount = Math.max(1, Math.ceil(totalBans / input.limit));

					if (input.page > pageCount) {
						input.page = pageCount;
					}

					return {
						data: ban,
						count: totalBans,
						pageCount
					};
				}
				case z.uuid().safeParse(input.query).success: {
					const ban = await db.query.playerBans.findMany({
						orderBy: [desc(schema.playerBans.createdAt)],
						limit: input.limit,
						offset: (input.page - 1) * input.limit,
						where: (ban, { eq }) => eq(ban.victimId, input.query),
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
						}
					});

					const rowQuery = await db
						.select({ value: count() })
						.from(schema.playerBans)
						.where(eq(schema.playerBans.victimId, input.query));
					let totalBans = 0;

					if (rowQuery[0]) {
						totalBans = Number(rowQuery[0].value);
					}

					const pageCount = Math.max(1, Math.ceil(totalBans / input.limit));

					if (input.page > pageCount) {
						input.page = pageCount;
					}

					return {
						data: ban,
						count: totalBans,
						pageCount
					};
				}
				default: {
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
						where: (ban, { inArray, or, ilike }) =>
							or(
								inArray(
									ban.victimId,
									db
										.select({ id: schema.player.uuid })
										.from(schema.player)
										.where(ilike(schema.player.name, `%${input.query}%`))
								),
								inArray(
									ban.authorId,
									db
										.select({ id: schema.user.id })
										.from(schema.user)
										.where(ilike(schema.user.name, `%${input.query}%`))
								),
								ilike(ban.reason, `%${input.query}%`)
							)
					});

					const rowQuery = await db
						.select({ value: count() })
						.from(schema.playerBans)
						.where(
							or(
								inArray(
									schema.playerBans.victimId,
									db
										.select({ id: schema.player.uuid })
										.from(schema.player)
										.where(ilike(schema.player.name, `%${input.query}%`))
								),
								inArray(
									schema.playerBans.authorId,
									db
										.select({ id: schema.user.id })
										.from(schema.user)
										.where(ilike(schema.user.name, `%${input.query}%`))
								),
								ilike(schema.playerBans.reason, `%${input.query}%`)
							)
						);
					let totalBans = 0;

					if (rowQuery[0]) {
						totalBans = Number(rowQuery[0].value);
					}

					const pageCount = Math.max(1, Math.ceil(totalBans / input.limit));

					if (input.page > pageCount) {
						input.page = pageCount;
					}

					return {
						data: ban,
						count: totalBans,
						pageCount
					};
				}
			}
		}),
	warns: permsProcedure
		.meta({
			permissionsRequired: 'VIEW_WARNINGS'
		})
		.input(
			z.object({
				query: z.string(),
				limit: z.int().min(1).max(100).default(10),
				page: z.int().min(1).default(1)
			})
		)
		.query(async ({ input }) => {
			switch (true) {
				case platformRegex.test(input.query): {
					const warn = await db.query.playerWarns.findMany({
						orderBy: [desc(schema.playerWarns.createdAt)],
						limit: input.limit,
						offset: (input.page - 1) * input.limit,
						where: (warn, { inArray, eq }) =>
							inArray(
								warn.victimId,
								db
									.select({ id: schema.player.uuid })
									.from(schema.player)
									.where(eq(schema.player.platformId, input.query))
							),
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
						}
					});

					const rowQuery = await db
						.select({ value: count() })
						.from(schema.playerWarns)
						.where(
							inArray(
								schema.playerWarns.victimId,
								db
									.select({ id: schema.player.uuid })
									.from(schema.player)
									.where(eq(schema.player.platformId, input.query))
							)
						);
					let totalWarnings = 0;

					if (rowQuery[0]) {
						totalWarnings = Number(rowQuery[0].value);
					}

					const pageCount = Math.max(1, Math.ceil(totalWarnings / input.limit));

					if (input.page > pageCount) {
						input.page = pageCount;
					}

					return {
						data: warn,
						count: totalWarnings,
						pageCount
					};
				}
				case z.uuid().safeParse(input.query).success: {
					const warn = await db.query.playerWarns.findMany({
						orderBy: [desc(schema.playerWarns.createdAt)],
						limit: input.limit,
						offset: (input.page - 1) * input.limit,
						where: (warn, { eq }) => eq(warn.victimId, input.query),
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
						}
					});

					const rowQuery = await db
						.select({ value: count() })
						.from(schema.playerWarns)
						.where(eq(schema.playerWarns.victimId, input.query));
					let totalWarnings = 0;

					if (rowQuery[0]) {
						totalWarnings = Number(rowQuery[0].value);
					}

					const pageCount = Math.max(1, Math.ceil(totalWarnings / input.limit));

					if (input.page > pageCount) {
						input.page = pageCount;
					}

					return {
						data: warn,
						count: totalWarnings,
						pageCount
					};
				}
				default: {
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
						where: (warn, { inArray, or, ilike }) =>
							or(
								inArray(
									warn.victimId,
									db
										.select({ id: schema.player.uuid })
										.from(schema.player)
										.where(ilike(schema.player.name, `%${input.query}%`))
								),
								inArray(
									warn.authorId,
									db
										.select({ id: schema.user.id })
										.from(schema.user)
										.where(ilike(schema.user.name, `%${input.query}%`))
								),
								ilike(warn.reason, `%${input.query}%`)
							)
					});

					const rowQuery = await db
						.select({ value: count() })
						.from(schema.playerWarns)
						.where(
							or(
								inArray(
									schema.playerWarns.victimId,
									db
										.select({ id: schema.player.uuid })
										.from(schema.player)
										.where(ilike(schema.player.name, `%${input.query}%`))
								),
								inArray(
									schema.playerWarns.authorId,
									db
										.select({ id: schema.user.id })
										.from(schema.user)
										.where(ilike(schema.user.name, `%${input.query}%`))
								),
								ilike(schema.playerWarns.reason, `%${input.query}%`)
							)
						);
					let totalWarnings = 0;

					if (rowQuery[0]) {
						totalWarnings = Number(rowQuery[0].value);
					}

					const pageCount = Math.max(1, Math.ceil(totalWarnings / input.limit));

					if (input.page > pageCount) {
						input.page = pageCount;
					}

					return {
						data: warn,
						count: totalWarnings,
						pageCount
					};
				}
			}
		}),
	deleteBan: permsProcedure
		.meta({ permissionsRequired: ['VIEW_BANS', 'DELETE_BANS'] })
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input }) => {
			try {
				const deleted = await db
					.delete(schema.playerBans)
					.where(eq(schema.playerBans.uuid, input.id))
					.returning();

				if (!deleted[0]) {
					return {
						success: false,
						message: 'Failed to delete ban.'
					};
				}

				return {
					success: true,
					message: 'Ban deleted successfully.'
				};
			} catch (err) {
				console.error(err);
				return {
					success: false,
					data: null,
					message: 'An error occurred while deleting ban.'
				};
			}
		}),
	deleteWarn: permsProcedure
		.meta({ permissionsRequired: ['VIEW_WARNINGS', 'DELETE_WARNINGS'] })
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input }) => {
			try {
				const deleted = await db
					.delete(schema.playerWarns)
					.where(eq(schema.playerWarns.uuid, input.id))
					.returning();

				if (!deleted[0]) {
					return {
						success: false,
						message: 'Failed to delete warn.'
					};
				}

				return {
					success: true,
					message: 'Warn deleted successfully.'
				};
			} catch (err) {
				console.error(err);
				return {
					success: false,
					data: null,
					message: 'An error occurred while deleting warn.'
				};
			}
		})
});
