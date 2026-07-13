import type { BetterAuthClientPlugin } from 'better-auth/client';
import type { dynamicOAuthPlugin } from './index'; // make sure to import the server plugin as a type

type DynamicOAuthPlugin = typeof dynamicOAuthPlugin;

export const dynamicOAuthClientPlugin = () => {
	return {
		id: 'dynamicOAuthPlugin',
		$InferServerPlugin: {} as ReturnType<DynamicOAuthPlugin>
	} satisfies BetterAuthClientPlugin;
};
