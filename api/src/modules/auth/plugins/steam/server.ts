import type { BetterAuthPlugin } from 'better-auth';
import { createAuthEndpoint, createAuthMiddleware, getSessionFromCtx } from 'better-auth/api';
import { setSessionCookie } from 'better-auth/cookies';

const STEAM_OPENID_URL = 'https://steamcommunity.com/openid/login';

export interface SteamOpenIdPluginOptions {
	steamApiKey: string;
	failureRedirect: string;
	successRedirect: string;
	allowSignIn?: boolean;
}

enum PersonaState {
	Offline,
	Online,
	Busy,
	Away,
	Snooze,
	LookingToTrade
}

enum VisibilityState {
	Private = 1,
	Public = 3
}

export interface SteamProfileSummaryResponse {
	response: {
		players: SteamProfileSummaryPlayers[];
	};
}

export interface SteamProfileSummaryPlayers {
	steamid: string;
	personaname: string;
	profileurl: string;
	avatar: string;
	avatarmedium: string;
	avatarfull: string;
	personastate: PersonaState;
	communityvisibilitystate: VisibilityState;
	profilestate: 1 | null;
	lastlogoff: number;
	commentpermission: 1 | null;
}

export const steamOpenId = (options: SteamOpenIdPluginOptions): BetterAuthPlugin => ({
	id: 'steam',

	endpoints: {
		steamLink: createAuthEndpoint(
			'/steam/link',
			{ method: 'GET', requireRequest: true },
			async (ctx) => {
				const params = new URLSearchParams({
					'openid.ns': 'http://specs.openid.net/auth/2.0',
					'openid.mode': 'checkid_setup',
					'openid.return_to': `${ctx.context.baseURL}/steam/callback`,
					'openid.realm': new URL(ctx.context.baseURL).origin,
					'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
					'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select'
				});

				return ctx.redirect(`${STEAM_OPENID_URL}?${params.toString()}`);
			}
		),

		steamCallback: createAuthEndpoint(
			'/steam/callback',
			{ method: 'GET', requireRequest: true },
			async (ctx) => {
				const params = Object.fromEntries(new URL(ctx.request.url).searchParams);

				// Verify with Steam
				const verifyParams = new URLSearchParams({
					...params,
					'openid.mode': 'check_authentication'
				});

				const verifyRes = await fetch(STEAM_OPENID_URL, {
					method: 'POST',
					body: verifyParams,
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
				});

				const verifyText = await verifyRes.text();
				if (!verifyText.includes('is_valid:true')) {
					return ctx.redirect(`${options.failureRedirect}?error=steam_invalid`);
				}

				// Extract Steam ID
				const steamId = params['openid.claimed_id']?.split('/').pop();
				console.log('Steam ID from OpenID:', steamId);
				if (!steamId) {
					return ctx.redirect(`${options.failureRedirect}?error=steam_no_id`);
				}

				// Get session from cookie
				const session = await getSessionFromCtx(ctx);
				if (!session?.user) {
					if (!options.allowSignIn) {
						return ctx.redirect(`${options.failureRedirect}?error=no_session`);
					}

					const linkedAccount = await ctx.context.internalAdapter.findAccountByProviderId(
						steamId,
						'steam'
					);
					if (linkedAccount) {
						const sessionProper = await ctx.context.internalAdapter.createSession(
							linkedAccount.userId
						);
						const sessionUser = await ctx.context.internalAdapter.findUserById(
							linkedAccount.userId
						);
						await setSessionCookie(ctx, {
							session: sessionProper,
							user: sessionUser!
						});

						return ctx.redirect(`${options.successRedirect}?code=login_linked`);
					}
				}

				await ctx.context.internalAdapter.linkAccount({
					createdAt: new Date(),
					updatedAt: new Date(),
					userId: session!.user.id,
					providerId: 'steam',
					accountId: steamId
				});

				return ctx.redirect(`${options.successRedirect}?code=linked`);
			}
		)
	},

	hooks: {
		after: [
			{
				matcher: (ctx) => ctx.path === '/account-info',
				handler: createAuthMiddleware(async (ctx) => {
					const providedAccountId = ctx.query?.accountId as string | undefined;
					if (!providedAccountId) return;

					const accountData = await ctx.context.internalAdapter.findAccountByProviderId(
						providedAccountId,
						'steam'
					);

					if (!accountData) return;

					const steamProfileRes = await fetch(
						`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${options.steamApiKey}&steamids=${providedAccountId}`
					);
					const steamProfile = (await steamProfileRes.json()) as SteamProfileSummaryResponse;

					if (!steamProfile?.response?.players?.[0]) return;

					return ctx.json(steamProfile.response.players[0]);
				})
			}
		]
	}
});
