import { building } from '$app/env';
import { defineEnvVars } from '@sveltejs/kit/env';
import { z } from 'zod';

export const variables = defineEnvVars({
	NODE_ENV: {
		public: true,
		schema: building ? z.optional(z.string()) : z.string()
	},
	DEMO: {
		public: true,
		schema: z.optional(z.stringbool()).default(false)
	},
	NAME: {
		public: true,
		schema: building ? z.optional(z.string()) : z.string()
	},
	URL: {
		public: true,
		schema: building ? z.optional(z.url()) : z.url()
	},
	APP_SECRET: {
		schema: building ? z.optional(z.string()) : z.string()
	},
	STEAM_API_KEY: {
		schema: building ? z.optional(z.string()) : z.string()
	},
	DISCORD_CLIENT_ID: {
		public: true,
		schema: building ? z.optional(z.string()) : z.string()
	},
	DISCORD_CLIENT_SECRET: {
		schema: building ? z.optional(z.string()) : z.string()
	},
	DRIZZLE_MIGRATION_DIR: {
		schema: z.optional(z.string())
	},
	SMTP_HOST: {
		schema: building ? z.optional(z.string()) : z.string()
	},
	SMTP_PORT: {
		schema: building ? z.optional(z.coerce.number<string>()) : z.coerce.number<string>()
	},
	SMTP_USER: {
		schema: building ? z.optional(z.string()) : z.string().optional()
	},
	SMTP_PASS: {
		schema: building ? z.optional(z.string()) : z.string().optional()
	},
	SMTP_FROM: {
		schema: building ? z.optional(z.string()) : z.string()
	}
});
