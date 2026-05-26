import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import trpcServer from '$lib/server/trpc-server';
import { hasPermSync } from '$lib/perm-utils';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { panelGroupFormSchema } from '../../../../schema';
import { type RoleFlagKeys, RoleFlags } from '@namepending/shared/user';

export const load: PageServerLoad = async ({ parent, params }) => {
	const { localUser } = await parent();

	if (!localUser || !hasPermSync(localUser, 'VIEW_ROLES')) redirect(302, '/');

	const role = await trpcServer.panel.administration.getPanelRole.query({ id: params.id });

	if (!role.success || !role.data) {
		redirect(302, '/admin/roles');
	}

	const flagList: RoleFlagKeys[] = [];
	for (const flag in RoleFlags) {
		const flagValue = RoleFlags[flag as RoleFlagKeys];

		const hasFlag = !!((role.data.permissions & flagValue) === flagValue);
		if (hasFlag) {
			flagList.push(flag as RoleFlagKeys);
		}
	}

	const roleParsed = {
		...role.data,
		id: role.data.uuid,
		description: role.data.description || '',
		permissions: flagList,
		gameGroup: role.data.gameGroupId
	};

	console.log(roleParsed);

	return {
		panelGroupForm: await superValidate(roleParsed, zod4(panelGroupFormSchema)),
		role: roleParsed
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(panelGroupFormSchema));
		if (!form.valid) {
			console.log(form);
			return fail(400, {
				panelGroupForm: form
			});
		}

		try {
			if (!event.locals.localUser || !hasPermSync(event.locals.localUser, 'CREATE_EDIT_ROLES'))
				fail(401, 'Unauthorized');

			const updateResult = await trpcServer.panel.administration.editPanelGroup.mutate({
				id: form.data.id,
				name: form.data.name,
				description: form.data.description,
				permissions: form.data.permissions,
				gameGroup: form.data.gameGroup
			});

			console.log(updateResult);

			if (!updateResult.success) {
				return fail(400, {
					panelGroupForm: form,
					message: updateResult.message || 'Failed to update panel group.'
				});
			}
			return message(form, `Your panel group has been updated`);
		} catch (err) {
			console.error('Error updating panel group:', err);
			return fail(500, {
				panelGroupForm: form,
				message: 'An error occurred while updating panel group.'
			});
		}
	}
};
