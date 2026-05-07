import db from '@modules/db';
import { permsProcedure, router } from '@modules/trpc';
import { JointFlags, platformRegex } from '@namepending/shared/user';
import { z } from 'zod';
import { moderationRouter } from './moderation';

export const panelRouter = router({
	moderation: moderationRouter,
	getProfile: permsProcedure
		.meta({
			permissionsRequired: async (ctx, input: unknown) => {
				if (
					(ctx.user!.group !== null &&
						(ctx.user!.group?.permissions & JointFlags.VIEW_USERS) !== 0n) ||
					(ctx.user!.flags & JointFlags.VIEW_USERS) !== 0n ||
					input === ctx.user!.id
				)
					return true;
				return false;
			}
		})
		.input(z.string())
		.query(async ({ ctx, input }) => {
			if (input === ctx.user.id) {
				return ctx.user;
			}

			const user = await db.query.user.findFirst({
				where: (user, { eq }) => eq(user.id, input),
				with: {
					group: true,
					players: true
				},
				columns: {
					email: false
				}
			});

			if (!user) {
				return null;
			}

			return user;
		}),
	getPlayer: permsProcedure
		.meta({
			permissionsRequired: async (ctx, input) => {
				if (
					(ctx.user!.group !== null &&
						(ctx.user!.group?.permissions & JointFlags.VIEW_USERS) !== 0n) ||
					(ctx.user!.flags & JointFlags.VIEW_USERS) !== 0n ||
					ctx.user!.players!.some((player) => player.uuid === input)
				)
					return true;
				return false;
			}
		})
		.input(z.string())
		.query(async ({ input }) => {
			switch (true) {
				case platformRegex.test(input): {
					const player = await db.query.player.findFirst({
						where: (player, { eq }) => eq(player.platformId, input),
						with: {
							user: true,
							bans: {
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
							},
							warns: {
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
							}
						}
					});

					if (!player) {
						return null;
					}

					return player;
				}
				default: {
					const player = await db.query.player.findFirst({
						where: (player, { eq }) => eq(player.uuid, input),
						with: {
							user: true,
							bans: {
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
							},
							warns: {
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
							}
						}
					});

					if (!player) {
						return null;
					}

					return player;
				}
			}
		})
});
