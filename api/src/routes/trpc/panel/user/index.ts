import db, { schema } from '@modules/db';
import { eq, inArray, and } from 'drizzle-orm';
import { authedProcedure, router } from '@modules/trpc';
import { z } from 'zod';

export const userRouter = router({
	getStats: authedProcedure.query(async ({ ctx }) => {
		const stats = await db.query.playerStats.findMany({
			where: inArray(
				schema.playerStats.playerId,
				db
					.select({ id: schema.player.uuid })
					.from(schema.player)
					.where(eq(schema.player.userId, ctx.user.id))
			)
		});

		if (stats.length === 0) {
			return null;
		}

		const summedStats = stats.reduce((acc, stat) => {
			acc.timeLastWeek += stat.timeLastWeek;
			acc.timeThisWeek += stat.timeThisWeek;
			acc.timeTotal += stat.timeTotal;
			return acc;
		});

		return summedStats;
	}),
	getPlayers: authedProcedure.query(async ({ ctx }) => {
		const players = await db.query.player.findMany({
			where: eq(schema.player.userId, ctx.user.id)
		});
		return players;
	}),
	getStatsForPlayer: authedProcedure
		.input(z.object({ playerId: z.uuid() }))
		.query(async ({ ctx, input }) => {
			const player = await db.query.player.findFirst({
				where: and(eq(schema.player.uuid, input.playerId), eq(schema.player.userId, ctx.user.id))
			});

			if (!player) {
				return {
					success: false,
					message: 'Player not found'
				};
			}

			const stats = await db.query.playerStats.findFirst({
				where: eq(schema.playerStats.playerId, player.uuid)
			});

			if (!stats) {
				return {
					success: false,
					message: 'Stats not found for this player'
				};
			}

			return {
				success: true,
				stats
			};
		})
});
