import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import trpcServer from '$lib/server/trpc/client';
import { hasPermSync } from '$lib/perm-utils';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { serverFormSchema } from '../../schema';

export const load: PageServerLoad = async ({ parent, url }) => {
	const { localUser } = await parent();
	const page = Number(url.searchParams.get('page') ?? '0');
	const query = url.searchParams.get('q') ?? '';

	if (!localUser || !hasPermSync(localUser, 'MANAGE_SERVERS')) redirect(302, '/');

	const servers = await trpcServer.panel.administration.getServers.query({
		query,
		page: page + 1
	});

	if (page + 1 > servers.pageCount) {
		redirect(302, `${url.pathname}?q=${query}&page=${servers.pageCount - 1}`);
	}

	return {
		servers,
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
			const updateResult = await trpcServer.panel.administration.addServer.mutate({
				description: form.data.description
			});
			if (!updateResult.success) {
				return fail(400, {
					form,
					message: updateResult.message || 'Failed to create server.'
				});
			}
			return message(form, {
				message: `Your server has been created, if you have the plugin set up, run the following install command: setupnamepending ${updateResult.token}`,
				token: updateResult.token
			});
		} catch (err) {
			console.error('Error creating server:', err);
			return fail(500, {
				form,
				message: 'An error occurred while creating server.'
			});
		}
	}
};
