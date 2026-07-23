import { betterAuth } from 'better-auth/minimal';
import { bearer } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import db, { schema } from '@modules/db';
import {
	APP_SECRET,
	APP_URL,
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	STEAM_API_KEY
} from '../config';
import { steamOpenId } from './plugins/steam/server';
import { createAuthMiddleware } from 'better-auth/api';
import { count, eq } from 'drizzle-orm';
import { UserFlags } from '@namepending/shared/user';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	baseURL: APP_URL,
	secret: APP_SECRET,
	trustedOrigins: [APP_URL!],
	emailAndPassword: {
		enabled: true
	},
	advanced: {
		useSecureCookies: true,
		cookiePrefix: 'namepending'
	},
	plugins: [
		steamOpenId({
			steamApiKey: STEAM_API_KEY,
			failureRedirect: '/auth/fail',
			successRedirect: '/',
			allowSignIn: false
		}),
		bearer()
	],
	socialProviders: {
		discord: {
			clientId: DISCORD_CLIENT_ID,
			clientSecret: DISCORD_CLIENT_SECRET
		}
	},
	hooks: {
		after: createAuthMiddleware(async (ctx) => {
			switch (true) {
				case ctx.path.startsWith('/sign-up') || ctx.path.startsWith('/callback'): {
					const userCount = await db.select({ count: count() }).from(schema.user);
					if (userCount[0]?.count === 1) {
						if (!ctx.context.newSession) {
							break;
						}

						await db
							.update(schema.user)
							.set({ flags: UserFlags.SUPERADMIN | UserFlags.USER })
							.where(eq(schema.user.id, ctx.context.newSession.user.id));
					}
					break;
				}
				case ctx.path.startsWith('/steam/link-callback'): {
					if (!ctx.context.session) {
						break;
					}

					if (!ctx.request) {
						break;
					}

					const params = Object.fromEntries(new URL(ctx.request.url).searchParams);

					const steamId = params['openid.claimed_id']?.split('/').pop();

					const account = ctx.context.internalAdapter.findAccountByProviderId(steamId!, 'steam');

					if (!account) {
						console.log(
							`No account found with provider id ${steamId}, cannot link steam account to user ${ctx.context.session.user.id}`
						);
						break;
					}

					const player = await db.query.player.findFirst({
						where: (player, { eq }) => eq(player.platformId, `${steamId!}@steam`)
					});

					if (!player) {
						console.log(
							`No player found with platform id ${steamId}@steam, cannot link steam account to user ${ctx.context.session.user.id}`
						);
						break;
					}

					await db
						.update(schema.player)
						.set({
							userId: ctx.context.session.user.id
						})
						.where(eq(schema.player.platformId, `${steamId!}@steam`));

					break;
				}
				default: {
					break;
				}
			}
		})
	}
});
