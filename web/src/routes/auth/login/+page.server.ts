import type { Actions, PageServerLoad } from './$types';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { loginSchema } from '../schema';
import { zod4 } from 'sveltekit-superforms/adapters';
import authServer from '$lib/server/auth-server';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.session) {
		redirect(303, '/');
	}

	return {
		form: await superValidate(zod4(loginSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(loginSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const result = await authServer.signIn.email({
			email: form.data.email,
			password: form.data.password
		});

		if (result.error) {
			return setError(form, '', result.error.message || 'An error occurred during login');
		}

		const returnPath = decodeURIComponent(event.url.searchParams.get('return') || '/');

		const url = new URL(returnPath, event.url.origin);

		url.searchParams.set('code', 'logged-in');

		redirect(303, url.toString());
	}
};
