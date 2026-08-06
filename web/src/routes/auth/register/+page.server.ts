import type { Actions, PageServerLoad } from './$types';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { registerSchema } from '../schema';
import { zod4 } from 'sveltekit-superforms/adapters';
import auth from '$lib/server/auth';
import { isAPIError } from 'better-auth/api';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.session) {
		redirect(303, '/');
	}

	return {
		form: await superValidate(zod4(registerSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(registerSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await auth.api.signUpEmail({
				body: {
					email: form.data.email,
					password: form.data.password,
					name: form.data.name
				}
			});
		} catch (error) {
			if (isAPIError(error)) {
				setError(form, '', error.message || 'An error occurred during registration');
			}
		}

		const returnPath = decodeURIComponent(event.url.searchParams.get('return') || '/');

		const url = new URL(returnPath, event.url.origin);

		url.searchParams.set('code', 'logged-in');

		redirect(303, url.toString());
	}
};
