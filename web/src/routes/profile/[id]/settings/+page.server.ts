import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import type { RouterOutput } from '$lib/trpc-client';
import trpc from '$lib/server/trpc-server';
import { updateRoleSchema } from '../schema';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
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
		roles,
		updateRoleForm: await superValidate(zod4(updateRoleSchema))
	};
}) satisfies PageServerLoad;

export const actions = {
	updateRole: async (event) => {
		const form = await superValidate(event, zod4(updateRoleSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await trpc.panel.moderation.player.setRole.mutate({
				user: event.params.id,
				role: form.data.role
			});
		} catch (err) {
			console.error(err);
			return fail(500, {
				form,
				error: 'An error occurred while updating the user role.'
			});
		}

		return {
			form
		};
	}
} satisfies Actions;
