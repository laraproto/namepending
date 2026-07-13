import authClient from '$lib/auth-client';
import { type RouterOutput } from '$lib/trpc-client';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: typeof authClient.$Infer.Session.session | null;
			user: typeof authClient.$Infer.Session.user | null;
			localUser: RouterOutput['getSelf'] | null;
			config: RouterOutput['config'];
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	interface BigInt {
		toJSON(): number | string;
	}
}

export {};
