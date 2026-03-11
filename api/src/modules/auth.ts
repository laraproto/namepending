import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import db from '@modules/db';
import { APP_SECRET, URL } from './config';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	baseURL: URL,
	secret: APP_SECRET,
	trustedOrigins: [URL!]
});
