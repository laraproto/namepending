import { betterAuth } from 'better-auth/minimal';
import { bearer } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import db, { schema } from '@modules/db';
import { APP_SECRET, URL } from '../config';
import { steamOpenId } from './plugins/steam/server';
import { createAuthMiddleware } from 'better-auth/api';
import { count, eq } from 'drizzle-orm';
import { UserFlags } from '@namepending/shared/user';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	baseURL: URL,
	secret: APP_SECRET,
	trustedOrigins: [URL!],
	emailAndPassword: {
		enabled: true
	},
	advanced: {
		cookiePrefix: 'namepending'
	},
	plugins: [
		steamOpenId({
			steamApiKey: process.env.STEAM_API_KEY!,
			failureRedirect: '/auth/fail',
			successRedirect: '/'
		}),
		bearer()
	],
	socialProviders: {
		discord: {
			clientId: process.env.DISCORD_CLIENT_ID as string,
			clientSecret: process.env.DISCORD_CLIENT_SECRET as string
		}
	},
	hooks: {
		after: createAuthMiddleware(async (ctx) => {
			if (!ctx.path.startsWith('/sign-up') && !ctx.path.startsWith('/callback')) {
				return;
			}

			const userCount = await db.select({ count: count() }).from(schema.user);
			if (userCount[0]?.count === 1) {
				if (!ctx.context.newSession) {
					return;
				}

				await db
					.update(schema.user)
					.set({ flags: UserFlags.SUPERADMIN })
					.where(eq(schema.user.id, ctx.context.newSession.user.id));
			}
		})
	}
});
