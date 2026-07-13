import trpc from '$lib/server/trpc-server';
import type { LayoutServerLoad } from './$types';
import { SIDEBAR_COOKIE_NAME } from '$lib/components/ui/sidebar/constants';

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
	try {
		return {
			localUser: await trpc.getSelf.query(),
			config: locals.config,
			sidebarOpen: cookies.get(SIDEBAR_COOKIE_NAME) === 'true'
		};
	} catch {
		return {
			localUser: null,
			config: locals.config,
			sidebarOpen: cookies.get(SIDEBAR_COOKIE_NAME) === 'true'
		};
	}
};
