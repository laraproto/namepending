import type { Actions, PageServerLoad } from './$types';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { registerSchema } from '../schema';
import { zod4 } from 'sveltekit-superforms/adapters';
import authServer from '$lib/server/auth-server';
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

		const result = await authServer.signUp.email({
			email: form.data.email,
			password: form.data.password,
			name: form.data.name
		});

		if (result.error) {
			return setError(form, '', result.error.message || 'An error occurred during registration');
		}

		redirect(303, '/?code=registered');
	}
};
