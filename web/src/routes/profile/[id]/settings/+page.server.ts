import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { resolve } from '$app/paths';
import type { RouterOutput } from '$lib/trpc-client';
import trpc from '$lib/server/trpc-server';
import { hasPerm } from '$lib/perm-utils';

type RolesOutput = RouterOutput['panel']['administration']['getPanelRoles'];

export const load = (async ({ parent, params }) => {
	const { user, localUser } = await parent();

	if (!user) {
		redirect(
			302,
			resolve('/profile/[id]', {
				id: params.id
			})
		);
	}

	let roles: RolesOutput | null = null;

	if (await hasPerm(localUser, 'VIEW_ROLES')) {
		roles = await trpc.panel.administration.getPanelRoles.query();
	}
	return {
		user,
		roles
	};
}) satisfies PageServerLoad;

export const actions = {
	updateRole: async (event) => {}
} satisfies Actions;
