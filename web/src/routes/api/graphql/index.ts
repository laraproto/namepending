import { builder } from './builder';

import type {
	UserSelect,
	UserSelectMinimal,
	PanelGroupSelect,
	GameGroupSelectMinimal,
	BansSelect,
	WarnsSelect,
	ServerSelect,
	PlayerSelectMinimal,
	PlayerSelect,
	BansSelectMinimal,
	WarnsSelectMinimal
} from '$lib/server/db/schema';
import auth from '$lib/server/auth';
import * as dbschema from '$lib/server/db/schema';
import db from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { LookupOutput, LinkOutput } from './types';
import { BanType, WarnType } from './types';
import * as token from '$lib/server/token';
import type { OAuthClient } from '@better-auth/oauth-provider';

const GroupRef = builder.objectRef<PanelGroupSelect>('Group');
const GameGroupRef = builder.objectRef<GameGroupSelectMinimal>('GameGroup');
const UserRef = builder.objectRef<UserSelect>('User');
const UserMinimalRef = builder.objectRef<UserSelectMinimal>('UserMinimal');
const PlayerMinimalRef = builder.objectRef<PlayerSelectMinimal>('PlayerMinimal');
const PlayerRef = builder.objectRef<PlayerSelect>('Player');
const ServerRef = builder.objectRef<ServerSelect>('Server');
const BanRef = builder.objectRef<BansSelect>('Ban');
const BanMinimalRef = builder.objectRef<BansSelectMinimal>('BanMinimal');
const WarnRef = builder.objectRef<WarnsSelect>('Warn');
const WarnMinimalRef = builder.objectRef<WarnsSelectMinimal>('WarnMinimal');

const LookupOutputRef = builder.objectRef<LookupOutput>('LookupOutput');
const LinkOutputRef = builder.objectRef<LinkOutput>('LinkOutput');
const OAuthClientRef = builder.objectRef<OAuthClient>('OAuthClient');

const BanTypeRef = builder.enumType(BanType, {
	name: 'BanType'
});

const WarnTypeRef = builder.enumType(WarnType, {
	name: 'WarnType'
});

const BanInputRef = builder.inputType('BanInput', {
	fields: (t) => ({
		author: t.string({
			required: true
		}),
		target: t.string({
			required: true
		}),
		reason: t.string({
			required: true
		}),
		duration: t.int({
			required: false
		}),
		type: t.field({
			type: BanTypeRef,
			required: true
		})
	})
});

const WarnInputRef = builder.inputType('WarnInput', {
	fields: (t) => ({
		author: t.string({
			required: true
		}),
		target: t.string({
			required: true
		}),
		reason: t.string({
			required: true
		}),
		duration: t.int({
			required: false
		}),
		type: t.field({
			type: WarnTypeRef,
			required: true
		})
	})
});

BanRef.implement({
	description: 'A ban',
	fields: (t) => ({
		id: t.exposeID('uuid'),
		author: t.field({
			type: UserRef,
			resolve: (ban) => ban.banAuthor
		}),
		victim: t.field({
			type: PlayerMinimalRef,
			resolve: (ban) => ban.banVictim
		}),
		reason: t.exposeString('reason'),
		expires: t.expose('expiresAt', {
			type: 'DateTime'
		}),
		active: t.exposeBoolean('active'),
		type: t.field({
			type: BanTypeRef,
			resolve: (ban) => ban.type as BanType
		}),
		created: t.expose('createdAt', {
			type: 'DateTime'
		}),
		updated: t.expose('updatedAt', {
			type: 'DateTime'
		})
	})
});

BanMinimalRef.implement({
	description: 'A ban with minimal information',
	fields: (t) => ({
		id: t.exposeID('uuid'),
		reason: t.exposeString('reason'),
		expires: t.expose('expiresAt', {
			type: 'DateTime'
		}),
		active: t.exposeBoolean('active'),
		type: t.field({
			type: BanTypeRef,
			resolve: (ban) => ban.type as BanType
		}),
		created: t.expose('createdAt', {
			type: 'DateTime'
		}),
		updated: t.expose('updatedAt', {
			type: 'DateTime'
		})
	})
});

WarnRef.implement({
	description: 'A warn',
	fields: (t) => ({
		id: t.exposeID('uuid'),
		author: t.field({
			type: UserRef,
			resolve: (warn) => warn.warnAuthor
		}),
		victim: t.field({
			type: PlayerMinimalRef,
			resolve: (warn) => warn.warnVictim
		}),
		reason: t.exposeString('reason'),
		expires: t.expose('expiresAt', {
			type: 'DateTime'
		}),
		active: t.exposeBoolean('active'),
		type: t.field({
			type: WarnTypeRef,
			resolve: (warn) => warn.type as WarnType
		}),
		created: t.expose('createdAt', {
			type: 'DateTime'
		}),
		updated: t.expose('updatedAt', {
			type: 'DateTime'
		})
	})
});

WarnMinimalRef.implement({
	description: 'A warn with minimal information',
	fields: (t) => ({
		id: t.exposeID('uuid'),
		reason: t.exposeString('reason'),
		expires: t.expose('expiresAt', {
			type: 'DateTime'
		}),
		active: t.exposeBoolean('active'),
		type: t.field({
			type: WarnTypeRef,
			resolve: (warn) => warn.type as WarnType
		}),
		created: t.expose('createdAt', {
			type: 'DateTime'
		}),
		updated: t.expose('updatedAt', {
			type: 'DateTime'
		})
	})
});

LookupOutputRef.implement({
	description: 'Output of lookup key creation',
	fields: (t) => ({
		key: t.exposeString('key'),
		expires: t.expose('expires', {
			type: 'DateTime'
		})
	})
});

LinkOutputRef.implement({
	description: 'Output of account link key creation',
	fields: (t) => ({
		key: t.exposeString('key'),
		expires: t.expose('expires', {
			type: 'DateTime'
		})
	})
});

OAuthClientRef.implement({
	description: 'An OAuth client',
	fields: (t) => ({
		client_id: t.field({
			type: 'String',
			resolve: (client) => client.client_id
		}),
		client_secret: t.field({
			type: 'String',
			resolve: (client) => client.client_secret
		}),
		redirect_uris: t.field({
			type: ['String'],
			resolve: (client) => client.redirect_uris
		}),
		skip_consent: t.field({
			type: 'Boolean',
			resolve: (client) => client.skip_consent
		}),
		enable_end_session: t.field({
			type: 'Boolean',
			resolve: (client) => client.enable_end_session
		})
	})
});

UserRef.implement({
	description: 'A user',
	fields: (t) => ({
		name: t.exposeString('name'),
		id: t.exposeID('id'),
		group: t.field({
			type: GroupRef,
			resolve: (user) => user.group
		}),
		created: t.expose('createdAt', {
			type: 'DateTime'
		}),
		updated: t.expose('updatedAt', {
			type: 'DateTime'
		})
	})
});

UserMinimalRef.implement({
	description: 'A user with minimal information',
	fields: (t) => ({
		name: t.exposeString('name'),
		id: t.exposeID('id'),
		created: t.expose('createdAt', {
			type: 'DateTime'
		}),
		updated: t.expose('updatedAt', {
			type: 'DateTime'
		})
	})
});

GroupRef.implement({
	description: 'A group',
	fields: (t) => ({
		name: t.exposeString('name'),
		id: t.exposeID('uuid'),
		description: t.exposeString('description'),
		permissions: t.field({
			type: 'BigInt',
			resolve: (group) => group.permissions
		}),
		created: t.expose('createdAt', {
			type: 'DateTime'
		}),
		updated: t.expose('updatedAt', {
			type: 'DateTime'
		}),
		gameGroup: t.field({
			type: GameGroupRef,
			resolve: (group) => group.gameGroup
		})
	})
});

GameGroupRef.implement({
	description: 'A game group',
	fields: (t) => ({
		name: t.exposeString('name'),
		id: t.exposeID('uuid'),
		description: t.exposeString('description'),
		color: t.exposeString('color'),
		created: t.expose('createdAt', {
			type: 'DateTime'
		}),
		updated: t.expose('updatedAt', {
			type: 'DateTime'
		}),
		permissions: t.exposeStringList('permissions')
	})
});

PlayerMinimalRef.implement({
	description: 'A player with minimal information',
	fields: (t) => ({
		name: t.exposeString('name'),
		platformId: t.exposeString('platformId'),
		id: t.exposeID('uuid'),
		doNotTrack: t.exposeBoolean('doNotTrack'),
		userId: t.exposeID('userId'),
		created: t.expose('createdAt', {
			type: 'DateTime'
		}),
		updated: t.expose('updatedAt', {
			type: 'DateTime'
		})
	})
});

PlayerRef.implement({
	description: 'A player',
	fields: (t) => ({
		name: t.exposeString('name'),
		platformId: t.exposeString('platformId'),
		id: t.exposeID('uuid'),
		doNotTrack: t.exposeBoolean('doNotTrack'),
		userId: t.exposeID('userId'),
		created: t.expose('createdAt', {
			type: 'DateTime'
		}),
		updated: t.expose('updatedAt', {
			type: 'DateTime'
		}),
		warns: t.field({
			type: [WarnMinimalRef],
			resolve: (player) => player.warns
		}),
		bans: t.field({
			type: [BanMinimalRef],
			resolve: (player) => player.bans
		}),
		user: t.field({
			type: UserRef,
			resolve: (player) => player.user
		})
	})
});

ServerRef.implement({
	description: 'A server',
	fields: (t) => ({
		description: t.exposeString('description'),
		creator: t.field({
			type: UserMinimalRef,
			resolve: (server) => server.creator
		}),
		id: t.exposeID('uuid'),
		created: t.expose('createdAt', {
			type: 'DateTime'
		})
	})
});

builder.queryType({
	fields: (t) => ({
		self: t.field({
			type: UserRef,
			resolve: (_root, _args, ctx) => ctx.locals.user
		}),
		server: t.field({
			type: ServerRef,
			resolve: (_root, _args, ctx) => ctx.locals.server
		}),
		player: t.field({
			type: PlayerRef,
			args: {
				platformId: t.arg.string({
					required: true
				})
			},
			resolve: async (_root, args) => {
				try {
					const player = await db.query.player.findFirst({
						where: (player, { eq }) => eq(player.platformId, args.platformId),
						with: {
							user: {
								with: {
									group: {
										with: {
											gameGroup: true
										}
									}
								}
							},
							warns: true,
							bans: true
						}
					});
					return player;
				} catch (err) {
					console.error(err);
					return null;
				}
			}
		}),
		warns: t.field({
			type: [WarnRef],
			authScopes: {
				server: true
			},
			args: {
				platformId: t.arg.string({
					required: true
				})
			},
			resolve: async (_root, args) => {
				try {
					const targetQuery = await db.query.player.findFirst({
						where: (player, { eq }) => eq(player.platformId, args.platformId)
					});

					if (!targetQuery) {
						return [];
					}

					const warns = await db.query.playerWarns.findMany({
						where: (warn, { eq }) => eq(warn.victimId, targetQuery.uuid),
						with: {
							warnAuthor: {
								with: {
									group: {
										with: {
											gameGroup: true
										}
									},
									players: true
								}
							},
							warnVictim: true
						}
					});

					return warns;
				} catch (err) {
					console.error(err);
					return [];
				}
			}
		}),
		bans: t.field({
			type: [BanRef],
			authScopes: {
				server: true
			},
			args: {
				platformId: t.arg.string({
					required: true
				})
			},
			resolve: async (_root, args) => {
				try {
					const targetQuery = await db.query.player.findFirst({
						where: (player, { eq }) => eq(player.platformId, args.platformId)
					});

					if (!targetQuery) {
						return [];
					}

					const bans = await db.query.playerBans.findMany({
						where: (ban, { eq }) => eq(ban.victimId, targetQuery.uuid),
						with: {
							banAuthor: {
								with: {
									group: {
										with: {
											gameGroup: true
										}
									},
									players: true
								}
							},
							banVictim: true
						}
					});

					return bans;
				} catch (err) {
					console.error(err);
					return [];
				}
			}
		}),
		roles: t.field({
			type: [GroupRef],
			authScopes: {
				server: true
			},
			resolve: async () => {
				const roles = await db.query.panelGroups.findMany({
					with: {
						gameGroup: true
					}
				});
				return roles;
			}
		})
	})
});

builder.mutationType({
	fields: (t) => ({
		createOAuthClient: t.field({
			type: OAuthClientRef,
			authScopes: {
				user: true,
				perm: 'SETTINGS'
			},
			args: {
				name: t.arg.string({
					required: true
				}),
				uris: t.arg.stringList({
					required: true
				}),
				skipConsent: t.arg.boolean({
					defaultValue: false,
					required: true
				}),
				enableEndSession: t.arg.boolean({
					defaultValue: false,
					required: true
				})
			},
			resolve: async (_root, args, ctx) => {
				try {
					const client = await auth.api.adminCreateOAuthClient({
						headers: ctx.request.headers,
						body: {
							client_name: args.name,
							redirect_uris: args.uris,
							skip_consent: args.skipConsent,
							enable_end_session: args.enableEndSession
						}
					});

					return client;
				} catch (err) {
					console.error(err);
					return null;
				}
			}
		}),
		createLookup: t.field({
			type: LookupOutputRef,
			authScopes: {
				server: true
			},
			nullable: true,
			args: {
				platformId: t.arg.string({
					required: true
				}),
				userIp: t.arg.string({
					required: false
				})
			},
			resolve: async (_root, args) => {
				try {
					const key = token.generateSessionToken();
					const lookup = await token.createLookupKey(key, args.platformId);

					return {
						key,
						expires: lookup.expiresAt
					};
				} catch (err) {
					console.error(err);
					return null;
				}
			}
		}),
		createAccountLink: t.field({
			type: LinkOutputRef,
			authScopes: {
				server: true
			},
			nullable: true,
			args: {
				platformId: t.arg.string({
					required: true
				})
			},
			resolve: async (_root, args) => {
				try {
					const key = token.createAccountLinkCode();

					const player = await db.query.player.findFirst({
						where: (player, { eq }) => eq(player.platformId, args.platformId)
					});

					if (!player) {
						return null;
					}

					const link = await token.createLinkEntry(key, player.uuid);

					return {
						key,
						expires: link.expiresAt
					};
				} catch (err) {
					console.error(err);
					return null;
				}
			}
		}),
		createPlayer: t.boolean({
			authScopes: {
				server: true
			},
			args: {
				platformId: t.arg.string({
					required: true
				}),
				name: t.arg.string({
					required: true
				}),
				doNotTrack: t.arg.boolean({
					required: true
				})
			},
			resolve: async (_root, args) => {
				try {
					const existingPlayer = await db.query.player.findFirst({
						where: (player, { eq }) => eq(player.platformId, args.platformId)
					});

					if (existingPlayer) {
						return false;
					}

					const playerQuery = await db
						.insert(dbschema.player)
						.values({
							platformId: args.platformId,
							name: args.name,
							doNotTrack: args.doNotTrack
						})
						.returning();

					if (playerQuery[0] && !playerQuery[0].doNotTrack) {
						await db
							.insert(dbschema.playerStats)
							.values({
								playerId: playerQuery[0].uuid
							})
							.returning();
					}

					return playerQuery.length > 0;
				} catch (err) {
					console.error(err);
					return false;
				}
			}
		}),
		updatePlayer: t.boolean({
			authScopes: {
				server: true
			},
			args: {
				platformId: t.arg.string({
					required: true
				}),
				name: t.arg.string({
					required: false
				}),
				doNotTrack: t.arg.boolean({
					required: false
				}),
				timeSpent: t.arg.int({
					required: true,
					defaultValue: 0
				})
			},
			resolve: async (_root, args) => {
				try {
					const playerQuery = await db.query.player.findFirst({
						where: (player, { eq }) => eq(player.platformId, args.platformId)
					});

					if (!playerQuery) {
						return false;
					}

					const updatedPlayer = await db
						.update(dbschema.player)
						.set({
							name: args.name ?? playerQuery.name,
							doNotTrack: args.doNotTrack ?? playerQuery.doNotTrack
						})
						.where(eq(dbschema.player.uuid, playerQuery.uuid))
						.returning();

					if (!args.doNotTrack) {
						const statsQuery = await db.query.playerStats.findFirst({
							where: (stats, { eq }) => eq(stats.playerId, playerQuery.uuid)
						});

						await db
							.insert(dbschema.playerStats)
							.values({
								playerId: playerQuery.uuid,
								uuid: statsQuery?.uuid ?? undefined,
								timeThisWeek: statsQuery?.timeThisWeek
									? statsQuery.timeThisWeek + args.timeSpent
									: (args.timeSpent ?? 0),
								timeTotal: statsQuery?.timeTotal
									? statsQuery.timeTotal + args.timeSpent
									: (args.timeSpent ?? 0)
							})
							.onConflictDoUpdate({
								target: dbschema.playerStats.playerId,
								set: {
									timeThisWeek: statsQuery?.timeThisWeek
										? statsQuery.timeThisWeek + args.timeSpent
										: (args.timeSpent ?? 0),
									timeTotal: statsQuery?.timeTotal
										? statsQuery.timeTotal + args.timeSpent
										: (args.timeSpent ?? 0)
								}
							});
					} else {
						await db
							.delete(dbschema.playerStats)
							.where(eq(dbschema.playerStats.playerId, playerQuery.uuid));
					}

					return updatedPlayer.length > 0;
				} catch (err) {
					console.error(err);
					return false;
				}
			}
		}),
		createBan: t.boolean({
			authScopes: {
				server: true
			},
			args: {
				input: t.arg({
					type: BanInputRef,
					required: true
				})
			},
			resolve: async (_root, args) => {
				try {
					const userQuery = await db.query.user.findFirst({
						where: (user, { eq, inArray }) =>
							inArray(
								user.id,
								db
									.select({ id: dbschema.player.userId })
									.from(dbschema.player)
									.where(eq(dbschema.player.platformId, args.input.author))
							)
					});

					if (!userQuery) {
						return false;
					}

					const targetQuery = await db.query.player.findFirst({
						where: (player, { eq }) => eq(player.platformId, args.input.target)
					});

					if (!targetQuery) {
						return false;
					}

					const ban = await db
						.insert(dbschema.playerBans)
						.values({
							authorId: userQuery.id,
							victimId: targetQuery.uuid,
							reason: args.input.reason,
							expiresAt: args.input.duration
								? new Date(Date.now() + args.input.duration * 1000)
								: new Date(),
							type: args.input.type,
							active: true
						})
						.returning();

					return ban.length > 0;
				} catch (err) {
					console.error(err);
					return false;
				}
			}
		}),
		createWarn: t.boolean({
			authScopes: {
				server: true
			},
			args: {
				input: t.arg({
					type: WarnInputRef,
					required: true
				})
			},
			resolve: async (_root, args) => {
				try {
					const userQuery = await db.query.user.findFirst({
						where: (user, { eq, inArray }) =>
							inArray(
								user.id,
								db
									.select({ id: dbschema.player.userId })
									.from(dbschema.player)
									.where(eq(dbschema.player.platformId, args.input.author))
							)
					});

					if (!userQuery) {
						return false;
					}

					const targetQuery = await db.query.player.findFirst({
						where: (player, { eq }) => eq(player.platformId, args.input.target)
					});

					if (!targetQuery) {
						return false;
					}

					const warn = await db
						.insert(dbschema.playerWarns)
						.values({
							authorId: userQuery.id,
							victimId: targetQuery.uuid,
							reason: args.input.reason,
							expiresAt: args.input.duration
								? new Date(Date.now() + args.input.duration * 1000)
								: new Date(),
							type: args.input.type,
							active: true
						})
						.returning();

					return warn.length > 0;
				} catch (err) {
					console.error(err);
					return false;
				}
			}
		})
	})
});

export const schema = builder.toSchema();
