import db, { schema } from '$lib/server/db';
import { eq, inArray, and } from 'drizzle-orm';
import { authedProcedure, router } from '$lib/server/trpc';
import { z } from 'zod';
import * as token from '$lib/server/token';

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
		}),
	linkPlayer: authedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
		const linkCode = await token.validateLinkEntry(input);

		if (!linkCode) {
			return {
				success: false,
				message: 'Invalid link code'
			};
		}

		if (linkCode.expiresAt < new Date()) {
			return {
				success: false,
				message: 'Link code has expired'
			};
		}

		const player = await db.query.player.findFirst({
			where: eq(schema.player.uuid, linkCode.playerId)
		});

		if (!player) {
			return {
				success: false,
				message: 'Player not found'
			};
		}

		await db
			.update(schema.player)
			.set({ userId: ctx.user.id })
			.where(eq(schema.player.uuid, player.uuid));

		await db.delete(schema.accountLinkCodes).where(eq(schema.accountLinkCodes.code, linkCode.code));

		return {
			success: true,
			message: 'Player linked successfully'
		};
	})
});
