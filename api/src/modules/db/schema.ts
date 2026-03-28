import { relations, sql } from 'drizzle-orm';
import {
	pgTable,
	pgEnum,
	varchar,
	uuid,
	text,
	timestamp,
	boolean,
	primaryKey,
	jsonb,
	bigint
} from 'drizzle-orm/pg-core';
import * as auth from './auth-schema';

const timeData = {
	createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp({ withTimezone: true }).$onUpdateFn(() => new Date())
};

export const panelGroups = pgTable('panelGroups', {
	uuid: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 80 }).notNull(),
	// Only shown on panel to describe what group is for
	description: varchar('description', { length: 400 }),
	gameGroupId: uuid('game_group_id')
		.notNull()
		.references(() => gameGroups.uuid, { onDelete: 'cascade' }),
	permissions: bigint({ mode: 'bigint' })
		.notNull()
		.default(sql`4::bigint`),
	...timeData
});

export const panelGroupsToInheritedGroups = pgTable(
	'panelGroupsInheritedGroups',
	{
		inheritingGroupId: uuid('owning_group')
			.notNull()
			.references(() => panelGroups.uuid, { onDelete: 'cascade' }),
		inheritedGroupId: uuid('owned_group')
			.notNull()
			.references(() => panelGroups.uuid, { onDelete: 'cascade' })
	},
	(t) => [primaryKey({ columns: [t.inheritedGroupId, t.inheritingGroupId] })]
);

export const panelGroupsToInheritedGroupsRelations = relations(
	panelGroupsToInheritedGroups,
	({ one }) => ({
		inheritingGroup: one(panelGroups, {
			fields: [panelGroupsToInheritedGroups.inheritingGroupId],
			references: [panelGroups.uuid],
			relationName: 'owningGroup'
		}),
		inheritedGroup: one(panelGroups, {
			fields: [panelGroupsToInheritedGroups.inheritedGroupId],
			references: [panelGroups.uuid],
			relationName: 'ownedGroup'
		})
	})
);

export const panelGroupsRelations = relations(panelGroups, ({ one, many }) => ({
	inheritingGroupsToInheritedGroups: many(panelGroupsToInheritedGroups, {
		relationName: 'owningGroup'
	}),
	inheritedGroupsToInheritingGroups: many(panelGroupsToInheritedGroups, {
		relationName: 'ownedGroup'
	}),
	gameGroup: one(gameGroups, {
		fields: [panelGroups.gameGroupId],
		references: [gameGroups.uuid]
	}),
	users: many(auth.user)
}));

export const gameGroups = pgTable('gameGroups', {
	uuid: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 80 }).notNull(),
	// Only shown on panel to describe what group is for
	description: varchar('description', { length: 400 }),
	// While SCP: Secret Laboratory does use bitwise permissions it will be wise to compute it as needed as I don't know if they are necessarily stable or if they will reuse indexes
	permissions: jsonb().$type<string[]>(),
	...timeData
});

export const gameGroupsToInheritedGroups = pgTable(
	'gameGroupsInheritedGroups',
	{
		inheritingGroupId: uuid('owning_group_id')
			.notNull()
			.references(() => gameGroups.uuid, { onDelete: 'cascade' }),
		inheritedGroupId: uuid('owned_group_id')
			.notNull()
			.references(() => gameGroups.uuid, { onDelete: 'cascade' })
	},
	(t) => [primaryKey({ columns: [t.inheritedGroupId, t.inheritingGroupId] })]
);

export const gameGroupsToInheritedGroupsRelations = relations(
	gameGroupsToInheritedGroups,
	({ one }) => ({
		inheritingGroup: one(gameGroups, {
			fields: [gameGroupsToInheritedGroups.inheritingGroupId],
			references: [gameGroups.uuid],
			relationName: 'owningGroup'
		}),
		inheritedGroup: one(gameGroups, {
			fields: [gameGroupsToInheritedGroups.inheritedGroupId],
			references: [gameGroups.uuid],
			relationName: 'ownedGroup'
		})
	})
);

export const gameGroupsRelations = relations(gameGroups, ({ many }) => ({
	panelGroups: many(panelGroups),
	inheritingGroupsToInheritedGroups: many(gameGroupsToInheritedGroups, {
		relationName: 'owningGroup'
	}),
	inheritedGroupsToInheritingGroups: many(gameGroupsToInheritedGroups, {
		relationName: 'ownedGroup'
	})
}));

export const player = pgTable('players', {
	uuid: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id').references(() => auth.user.id, {
		onDelete: 'set null'
	}),
	name: varchar('name', { length: 80 }).notNull(),
	// this is a platform id, sl at the time of writing this comment supports both steam and discord auth, it's better to genericize the name
	platformId: varchar('platform_id', { length: 256 }).unique().notNull(),
	doNotTrack: boolean('do_not_track').notNull().default(true), // if a player's do not track has not been picked up, assume yes for privacy reasons
	...timeData // service information, if data ever needs to be pruned at least this will tell of us any data that we can remove easily
});

export const playerRelations = relations(player, ({ one, many }) => ({
	user: one(auth.user, {
		fields: [player.userId],
		references: [auth.user.id]
	}),
	bans: many(playerBans, { relationName: 'banVictim' }),
	warns: many(playerWarns, { relationName: 'warnVictim' })
}));

export const bansEnum = pgEnum('banType', ['temporary', 'permanent']);

export const playerBans = pgTable('playerBans', {
	uuid: uuid('id').primaryKey().defaultRandom(),
	authorId: text('author_id').references(() => auth.user.id, {
		onDelete: 'set null'
	}),
	victimId: uuid('victim_id')
		.references(() => player.uuid, { onDelete: 'cascade' })
		.notNull(),
	reason: varchar('reason', { length: 1000 }),
	type: bansEnum().notNull(),
	expiresAt: timestamp('expires_at').notNull().defaultNow(),
	active: boolean('active').notNull().default(true),
	...timeData
});

export const warnsEnum = pgEnum('warnType', ['minor', 'major', 'tempminor', 'tempmajor']);

export const playerWarns = pgTable('playerWarns', {
	uuid: uuid('id').primaryKey().defaultRandom(),
	authorId: text('author_id').references(() => auth.user.id, {
		onDelete: 'set null'
	}),
	victimId: uuid('victim_id')
		.references(() => player.uuid, { onDelete: 'cascade' })
		.notNull(),
	reason: varchar('reason', { length: 1000 }),
	hidden: boolean('hidden').notNull().default(false),
	type: warnsEnum().notNull(),
	expiresAt: timestamp('expires_at').notNull().defaultNow(),
	active: boolean('active').notNull().default(true),
	...timeData
});

export const playerBansRelations = relations(playerBans, ({ one }) => ({
	banAuthor: one(auth.user, {
		fields: [playerBans.authorId],
		references: [auth.user.id],
		relationName: 'banAuthor'
	}),
	banVictim: one(player, {
		fields: [playerBans.victimId],
		references: [player.uuid],
		relationName: 'banVictim'
	})
}));

export const playerWarnsRelations = relations(playerWarns, ({ one }) => ({
	warnAuthor: one(auth.user, {
		fields: [playerWarns.authorId],
		references: [auth.user.id],
		relationName: 'warnAuthor'
	}),
	warnVictim: one(player, {
		fields: [playerWarns.victimId],
		references: [player.uuid],
		relationName: 'warnVictim'
	})
}));

export const lookupKeys = pgTable('lookup_keys', {
	uuid: uuid('id').primaryKey().defaultRandom(),
	code: varchar('code', { length: 64 }).notNull().unique(),
	expiresAt: timestamp('expires_at').notNull().defaultNow(),
	playerId: uuid('player_id')
		.references(() => player.uuid, { onDelete: 'cascade' })
		.notNull(),
	...timeData
});

export const accountLinkCodes = pgTable('accountLinkCodes', {
	uuid: uuid('id').primaryKey().defaultRandom(),
	code: varchar('code', { length: 64 }).notNull().unique(),
	expiresAt: timestamp('expires_at').notNull().defaultNow(),
	playerId: uuid('player_id')
		.references(() => player.uuid, { onDelete: 'cascade' })
		.notNull(),
	...timeData
});

export const accountLinkRelations = relations(accountLinkCodes, ({ one }) => ({
	player: one(player, {
		fields: [accountLinkCodes.playerId],
		references: [player.uuid]
	})
}));

// Used for communication between server and api
export const servers = pgTable('serverApiKey', {
	uuid: uuid('id').primaryKey().defaultRandom(),
	// store the hashed representation you fuck
	key: varchar('key', { length: 64 }).notNull().unique(),
	creatorId: text('creator_id')
		.notNull()
		.references(() => auth.user.id, { onDelete: 'cascade' }),
	description: varchar('description', { length: 255 }),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const serversRelations = relations(servers, ({ one }) => ({
	creator: one(auth.user, {
		fields: [servers.creatorId],
		references: [auth.user.id]
	})
}));

export * from './auth-schema';
