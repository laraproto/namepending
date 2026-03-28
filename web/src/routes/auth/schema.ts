import { z } from 'zod';

export const registerSchema = z
	.object({
		email: z.email('Invalid email address'),
		password: z.string().min(8, 'Password must be at least 8 characters long'),
		passwordConfirmation: z
			.string()
			.min(8, 'Password confirmation must be at least 8 characters long'),
		name: z.string().min(2, 'Name must be at least 2 characters long')
	})
	.refine((data) => data.password === data.passwordConfirmation, {
		message: 'Passwords do not match'
	});

export type RegisterSchema = typeof registerSchema;

export const loginSchema = z.object({
	email: z.email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters long')
});

export type LoginSchema = typeof loginSchema;
