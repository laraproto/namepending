import type { BetterAuthPlugin } from 'better-auth';
import { createAuthEndpoint, getSessionFromCtx } from 'better-auth/api';

const STEAM_OPENID_URL = 'https://steamcommunity.com/openid/login';

export interface SteamOpenIdPluginOptions {
	steamApiKey: string;
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

interface SteamProfileSummaryResponse {
	response: {
		players: SteamProfileSummaryPlayers[];
	};
}

interface SteamProfileSummaryPlayers {
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
	id: 'steam-openid',

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
					return ctx.redirect(`${process.env.WEBSITE_URL}/panel?error=steam_invalid`);
				}

				// Extract Steam ID
				const steamId = params['openid.claimed_id']?.split('/').pop();
				console.log('Steam ID from OpenID:', steamId);
				if (!steamId) {
					return ctx.redirect(`${process.env.WEBSITE_URL}/panel?error=steam_no_id`);
				}

				// Get session from cookie
				const session = await getSessionFromCtx(ctx);
				if (!session?.user) {
					return ctx.redirect(`${process.env.WEBSITE_URL}/panel?error=no_session`);
				}

				// Fetch Steam profile
				const steamProfileRes = await fetch(
					`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${options.steamApiKey}&steamids=${steamId}`
				);
				const steamProfile = (await steamProfileRes.json()) as SteamProfileSummaryResponse;
				const steamPlayer = steamProfile?.response?.players?.[0];
				const steamName = steamPlayer?.personaname ?? 'Unknown';
				const steamAvatar = steamPlayer?.avatarfull ?? null;

				await ctx.context.adapter.create({
					model: 'account',
					data: {
						userId: session.user.id,
						accountId: steamId,
						providerId: 'steam',
						createdAt: new Date(),
						updatedAt: new Date()
					}
				});

				return ctx.redirect(`${process.env.WEBSITE_URL}/panel?link=true`);
			}
		)
	}
});
