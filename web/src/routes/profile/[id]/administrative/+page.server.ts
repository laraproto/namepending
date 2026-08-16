import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import type { RouterOutput } from '$lib/trpc';
import trpc from '$lib/server/trpc/client';
import { updateRoleSchema } from '../schema';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { hasPerm } from '$lib/perm-utils';

type RolesOutput = RouterOutput['panel']['administration']['getPanelRoles'];

export const load = (async ({ parent, params, locals }) => {
	const { userProfile } = await parent();

	if (!userProfile) {
		redirect(
			302,
			resolve('/profile/[id]', {
				id: params.id
			})
		);
	}

	let roles: RolesOutput | null = null;

	if (await hasPerm(locals.user, 'VIEW_ROLES')) {
		roles = await trpc.panel.administration.getPanelRoles.query();
	}
	return {
		userProfile,
		roles,
		updateRoleForm: await superValidate(
			{ role: userProfile.group?.uuid ?? undefined },
			zod4(updateRoleSchema)
		)
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
			if (!(await hasPerm(event.locals.user, ['VIEW_USERS', 'VIEW_ROLES', 'CREATE_EDIT_ROLES']))) {
				setError(form, 'role', 'You do not have permission to update user roles.');
			}

			await trpc.panel.administration.setRole.mutate({
				user: event.params.id,
				role:
					form.data.role === 'none' || form.data.role === '' || form.data.role === undefined
						? null
						: form.data.role
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
