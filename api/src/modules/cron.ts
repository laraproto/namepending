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

	const expiredLookups = await db.query.lookupKeys.findMany({
		where: (lookupKeys, { lte }) => lte(lookupKeys.expiresAt, now)
	});

	const expiredLinkCodes = await db.query.accountLinkCodes.findMany({
		where: (accountLinkCodes, { lte }) => lte(accountLinkCodes.expiresAt, now)
	});

	console.log(
		`Found ${expiredWarns.length} expired warns, ${expiredBans.length} expired bans, ${expiredLookups.length} expired lookup keys and ${expiredLinkCodes.length} account link codes.`
	);

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

	for await (const lookup of expiredLookups) {
		await db.delete(schema.lookupKeys).where(eq(schema.lookupKeys.uuid, lookup.uuid));
	}

	for await (const codes of expiredLinkCodes) {
		await db.delete(schema.accountLinkCodes).where(eq(schema.accountLinkCodes.uuid, codes.uuid));
	}
});

Bun.cron('0 0 * * 1', async () => {
	const statQueries = await db.query.playerStats.findMany();

	for await (const stat of statQueries) {
		await db
			.update(schema.playerStats)
			.set({
				timeThisWeek: 0,
				timeLastWeek: stat.timeThisWeek
			})
			.where(eq(schema.playerStats.uuid, stat.uuid));
	}
});
