import type { LayoutServerLoad } from './$types';
import { SIDEBAR_COOKIE_NAME } from '$lib/components/ui/sidebar/constants';

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
	try {
		return {
			localUser: locals.user,
			sidebarOpen: cookies.get(SIDEBAR_COOKIE_NAME) === 'true'
		};
	} catch {
		return {
			localUser: null,
			sidebarOpen: cookies.get(SIDEBAR_COOKIE_NAME) === 'true'
		};
	}
};
