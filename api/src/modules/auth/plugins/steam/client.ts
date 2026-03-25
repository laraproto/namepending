import type { BetterAuthClientPlugin } from 'better-auth';
import type { steamOpenId } from '.';

export const steamOpenIdClient = () => {
	return {
		id: 'steam',
		$InferServerPlugin: {} as ReturnType<typeof steamOpenId>,
		pathMethods: {
			'/steam/link': 'GET'
		}
	} satisfies BetterAuthClientPlugin;
};
