import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { jwt, bearer } from 'better-auth/plugins';
import { oauthProvider } from '@better-auth/oauth-provider';

import { steamOpenId } from '$lib/auth/plugins';

import { STEAM_API_KEY, APP_SECRET, DISCORD_CLIENT_SECRET, SMTP_FROM } from '$app/env/private';
import { URL as APP_URL, DISCORD_CLIENT_ID, NAME } from '$app/env/public';
import { building } from '$app/environment';

import { getRequestEvent } from '$app/server';
import transporter from '$lib/server/email';
import { ResetEmail } from '@namepending/transactional/email/reset';
import { render } from 'react-email';
import db, { schema } from '$lib/server/db';
import { createAuthMiddleware } from 'better-auth/api';
import { count, eq } from 'drizzle-orm';
import { UserFlags } from '@namepending/shared/user';

const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	baseURL: {
		allowedHosts: !building ? [new URL(APP_URL!).host] : ['localhost:3000']
	},
	secret: !building ? APP_SECRET : crypto.randomUUID(),
	user: {
		additionalFields: {
			theme: {
				type: 'string',
				defaultValue: 'system',
				required: false,
				input: true
			}
		}
	},
	plugins: [
		jwt(),
		bearer(),
		steamOpenId({
			steamApiKey: STEAM_API_KEY ?? '',
			failureRedirect: '/auth/fail',
			successRedirect: '/settings',
			allowSignIn: false
		}),
		oauthProvider({
			loginPage: '/auth/login',
			consentPage: '/auth/consent',
			signUp: {
				page: '/auth/register'
			}
		}),
		sveltekitCookies(getRequestEvent)
	],
	advanced: {
		useSecureCookies: true,
		cookiePrefix: 'namepending'
	},
	socialProviders: {
		discord: {
			clientId: DISCORD_CLIENT_ID ?? '',
			clientSecret: DISCORD_CLIENT_SECRET,
			overrideUserInfoOnSignIn: true
		}
	},
	emailAndPassword: {
		enabled: true,
		sendResetPassword: async ({ user, url }) => {
			void transporter.sendMail({
				from: `${NAME} <${SMTP_FROM}>`,
				to: user.email,
				subject: 'Password Reset Request',
				html: await render(<ResetEmail url={url} />)
			});
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

export default auth;
export type Auth = typeof auth;
