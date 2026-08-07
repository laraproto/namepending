import type { Actions, PageServerLoad } from './$types';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { loginSchema } from '../schema';
import { zod4 } from 'sveltekit-superforms/adapters';
import auth from '$lib/server/auth';
import { isAPIError } from 'better-auth/api';
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

		try {
			await auth.api.signInEmail({
				body: {
					email: form.data.email,
					password: form.data.password
				}
			});
		} catch (error) {
			if (isAPIError(error)) {
				setError(form, '', error.message || 'An error occurred during login');
			}
		}

		const returnPath = decodeURIComponent(event.url.searchParams.get('return') || '/');

		const url = new URL(returnPath, event.url.origin);

		url.searchParams.set('code', 'logged-in');

		redirect(303, url.toString());
	}
};
