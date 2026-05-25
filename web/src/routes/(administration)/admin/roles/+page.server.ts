import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import trpcServer from '$lib/server/trpc-server';
import { hasPermSync } from '$lib/perm-utils';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { panelGroupFormSchema } from '../../schema';

export const load: PageServerLoad = async ({ parent }) => {
	const { localUser } = await parent();

	if (!localUser || !hasPermSync(localUser, 'VIEW_ROLES')) redirect(302, '/');

	const panelRoles = await trpcServer.panel.administration.getPanelRoles.query();

	const gameRoles = await trpcServer.panel.administration.getGameRoles.query();

	return {
		panelRoles,
		gameRoles,
		panelGroupForm: await superValidate(zod4(panelGroupFormSchema))
	};
};

export const actions: Actions = {
	panelGroup: async (event) => {
		const form = await superValidate(event, zod4(panelGroupFormSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			if (!event.locals.localUser || !hasPermSync(event.locals.localUser, 'CREATE_EDIT_ROLES'))
				fail(401, 'Unauthorized');

			const updateResult = await trpcServer.panel.administration.addPanelGroup.mutate({
				name: form.data.name,
				description: form.data.description,
				permissions: form.data.permissions,
				gameGroup: form.data.gameGroup
			});
			if (!updateResult.success) {
				return fail(400, {
					form,
					message: updateResult.message || 'Failed to create panel group.'
				});
			}
			return message(form, `Your panel group has been created`);
		} catch (err) {
			console.error('Error creating panel group:', err);
			return fail(500, {
				form,
				message: 'An error occurred while creating panel group.'
			});
		}
	}
};
