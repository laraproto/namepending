import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import trpcServer from '$lib/server/trpc/client';
import { hasPermSync } from '$lib/perm-utils';
import { superValidate, message } from 'sveltekit-superforms';
import { banSchema } from '../schema';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ parent, url, locals }) => {
	const { player } = await parent();
	const page = Number(url.searchParams.get('page') ?? '0');
	const query = url.searchParams.get('q') ?? '';

	if (!locals.user || !hasPermSync(locals.user, 'VIEW_BANS')) redirect(302, '/');

	if (!player) {
		redirect(302, '/');
	}

	const bans = await trpcServer.panel.moderation.player.getBans.query({
		uuid: player.uuid,
		page: page + 1
	});

	if (page + 1 > bans.pageCount) {
		redirect(302, `${url.pathname}?q=${query}&page=${bans.pageCount - 1}`);
	}

	return {
		player,
		bans,
		form: await superValidate(zod4(banSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(banSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			if (!event.locals.user || !hasPermSync(event.locals.user, 'CREATE_BANS'))
				fail(401, 'Unauthorized');

			const updateResult = await trpcServer.panel.moderation.player.createBan.mutate({
				uuid: form.data.uuid,
				reason: form.data.reason,
				expiresAt: form.data.expiresAt,
				permanent: form.data.permanent
			});
			if (!updateResult.success) {
				return fail(400, {
					form,
					message: updateResult.message || 'Failed to create ban.'
				});
			}
			return message(form, 'Ban created successfully');
		} catch (err) {
			console.error('Error creating ban:', err);
			return fail(500, {
				form,
				message: 'An error occurred while creating ban.'
			});
		}
	}
};
