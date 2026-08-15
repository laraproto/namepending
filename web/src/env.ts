import { building } from '$app/env';
import { defineEnvVars } from '@sveltejs/kit/env';
import { z } from 'zod';

export const variables = defineEnvVars({
	NODE_ENV: {
		public: true,
		schema: building ? z.optional(z.string()) : z.string()
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
  }
});
