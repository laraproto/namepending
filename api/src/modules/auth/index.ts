import { betterAuth } from 'better-auth/minimal';
import { bearer } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import db from '@modules/db';
import { APP_SECRET, URL } from '../config';
import { steamOpenId } from './plugins/steam/server';

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
	}
});
