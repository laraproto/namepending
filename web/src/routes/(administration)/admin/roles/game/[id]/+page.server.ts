import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import trpcServer from '$lib/server/trpc-server';
import { hasPermSync } from '$lib/perm-utils';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { gameGroupFormSchema } from '../../../../schema';
import { type Permission } from '@namepending/shared/sl';

export const load: PageServerLoad = async ({ parent, params }) => {
	const { localUser } = await parent();

	if (!localUser || !hasPermSync(localUser, 'VIEW_ROLES')) redirect(302, '/');

	const role = await trpcServer.panel.administration.getGameRole.query({ id: params.id });

	if (!role.success || !role.data) {
		redirect(302, '/admin/roles');
	}

	const roleParsed = {
		...role.data,
		id: role.data.uuid,
		description: role.data.description || '',
		permissions: role.data.permissions || ([] as Permission[])
	};

	return {
		gameGroupForm: await superValidate(roleParsed, zod4(gameGroupFormSchema)),
		role: roleParsed
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(gameGroupFormSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			if (!event.locals.localUser || !hasPermSync(event.locals.localUser, 'CREATE_EDIT_ROLES'))
				fail(401, 'Unauthorized');

			const updateResult = await trpcServer.panel.administration.addGameGroup.mutate({
				name: form.data.name,
				description: form.data.description,
				permissions: form.data.permissions
			});
			if (!updateResult.success) {
				return fail(400, {
					form,
					message: updateResult.message || 'Failed to create game group.'
				});
			}
			return message(form, `Your game group has been created`);
		} catch (err) {
			console.error('Error creating game group:', err);
			return fail(500, {
				form,
				message: 'An error occurred while creating game group.'
			});
		}
	}
};
