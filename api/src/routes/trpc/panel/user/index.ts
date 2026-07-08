import db, { schema } from '@modules/db';
import { eq, inArray } from 'drizzle-orm';
import { authedProcedure, router } from '@modules/trpc';
import { z } from 'zod';

export const userRouter = router({
	getStats: authedProcedure.query(async ({ ctx }) => {
		const stats = await db.query.playerStats.findMany({
			where: inArray(schema.playerStats.playerId, db.select({ id: schema.player.uuid }).from(schema.player).where(eq(schema.player.userId, ctx.user.id)))
    });

    if (stats.length === 0) {
      return null
		}

		const summedStats = stats.reduce((acc, stat) => {
			acc.timeLastWeek += stat.timeLastWeek;
			acc.timeThisWeek += stat.timeThisWeek;
			acc.timeTotal += stat.timeTotal;
			return acc;
		});

		return summedStats;
	})
});
