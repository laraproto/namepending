import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import trpcServer from '$lib/server/trpc-server';
import { hasPermSync } from '$lib/perm-utils';
import { superValidate, message } from 'sveltekit-superforms';
import { warnSchema } from '../schema';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ parent }) => {
	const { player, localUser } = await parent();

	if (!localUser || !hasPermSync(localUser, 'VIEW_WARNINGS')) redirect(302, '/');

	if (!player) {
		redirect(302, '/');
	}

	return {
		player,
		form: await superValidate(zod4(warnSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(warnSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const updateResult = await trpcServer.panel.moderation.player.createWarn.mutate({
				uuid: form.data.uuid,
				reason: form.data.reason,
				expiresAt: form.data.expiresAt,
				type: form.data.type
			});
			if (!updateResult.success) {
				return fail(400, {
					form,
					message: updateResult.message || 'Failed to create warn.'
				});
			}
			return message(form, 'Warn created successfully');
		} catch (err) {
			console.error('Error creating warn:', err);
			return fail(500, {
				form,
				message: 'An error occurred while creating warn.'
			});
		}
	}
};
