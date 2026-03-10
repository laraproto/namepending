import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import db from '@modules/db';
import { BETTER_AUTH_SECRET, URL } from './config';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	baseURL: URL,
	secret: BETTER_AUTH_SECRET,
	trustedOrigins: [URL!]
});
