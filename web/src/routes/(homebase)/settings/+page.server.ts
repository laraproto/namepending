import type { PageServerLoad, Actions } from './$types';
import { linkSchema } from './schema';
import { fail, setError, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { redirect } from '@sveltejs/kit';
import trpc from '$lib/server/trpc/client';

export const load = (async ({ locals }) => {
	if (!locals.session || !locals.user) {
		redirect(302, '/auth/login');
	}

	return {
		linkForm: await superValidate(zod4(linkSchema))
	};
}) satisfies PageServerLoad;

export const actions = {
	linkAccount: async (event) => {
		const form = await superValidate(event, zod4(linkSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const result = await trpc.panel.user.linkPlayer.mutate(form.data.code);

			if (!result.success) {
				return setError(form, 'code', result.message);
			}

			return message(form, result.message || 'Account linked successfully.');
		} catch (err) {
			console.error(err);
			return setError(form, 'code', 'An unexpected error occurred while linking the account.');
		}

		return {
			form
		};
	}
} satisfies Actions;
