import type { BetterAuthPlugin } from 'better-auth';

export const dynamicOAuthPlugin = () =>
	({
		id: 'dynamicOAuthPlugin',
    endpoints: {

		}
	}) satisfies BetterAuthPlugin;
