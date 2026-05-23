import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import trpcServer from '$lib/server/trpc-server';
import { hasPermSync } from '$lib/perm-utils';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { serverFormSchema } from '../../schema';

export const load: PageServerLoad = async ({ parent }) => {
	const { localUser } = await parent();

	if (!localUser || !hasPermSync(localUser, 'VIEW_ROLES')) redirect(302, '/');

	const panelRoles = await trpcServer.panel.administration.getPanelRoles.query();

	const gameRoles = await trpcServer.panel.administration.getGameRoles.query();

	return {
		panelRoles,
		gameRoles,
		form: await superValidate(zod4(serverFormSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(serverFormSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			if (!event.locals.localUser || !hasPermSync(event.locals.localUser, 'CREATE_EDIT_ROLES'))
				fail(401, 'Unauthorized');

			const updateResult = await trpcServer.panel.administration.addServer.mutate({
				description: form.data.description
			});
			if (!updateResult.success) {
				return fail(400, {
					form,
					message: updateResult.message || 'Failed to create server.'
				});
			}
			return message(
				form,
				`Your server has been created, copy the key now as it won't be shown again: ${updateResult.token}`
			);
		} catch (err) {
			console.error('Error creating server:', err);
			return fail(500, {
				form,
				message: 'An error occurred while creating server.'
			});
		}
	}
};
