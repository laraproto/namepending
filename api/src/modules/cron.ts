import { cron } from 'bun';
import { eq } from 'drizzle-orm';
import db, { schema } from './db';

cron('* * * * *', async () => {
	const now = new Date();

	const expiredWarns = await db.query.playerWarns.findMany({
		where: (playerWarns, { lte, eq, and, or }) =>
			and(
				lte(playerWarns.expiresAt, now),
				or(eq(playerWarns.type, 'tempmajor'), eq(playerWarns.type, 'tempminor')),
				eq(playerWarns.active, true)
			)
	});

	const expiredBans = await db.query.playerBans.findMany({
		where: (playerBans, { lte, ne, eq, and }) =>
			and(
				lte(playerBans.expiresAt, now),
				ne(playerBans.type, 'permanent'),
				eq(playerBans.active, true)
			)
	});

	console.log(`Found ${expiredWarns.length} expired warns and ${expiredBans.length} expired bans`);

	for await (const warn of expiredWarns) {
		await db
			.update(schema.playerWarns)
			.set({ active: false })
			.where(eq(schema.playerWarns.uuid, warn.uuid));
	}

	for await (const ban of expiredBans) {
		await db
			.update(schema.playerBans)
			.set({ active: false })
			.where(eq(schema.playerBans.uuid, ban.uuid));
	}
});
