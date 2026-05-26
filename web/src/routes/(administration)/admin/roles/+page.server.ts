import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import trpcServer from '$lib/server/trpc-server';
import { hasPermSync } from '$lib/perm-utils';
export const load: PageServerLoad = async ({ parent }) => {
	const { localUser } = await parent();

	if (!localUser || !hasPermSync(localUser, 'VIEW_ROLES')) redirect(302, '/');

	const panelRoles = await trpcServer.panel.administration.getPanelRoles.query();

	const gameRoles = await trpcServer.panel.administration.getGameRoles.query();

	return {
		panelRoles,
		gameRoles
	};
};
