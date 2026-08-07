import authClient from '$lib/auth';
import { type RouterOutput } from '$lib/trpc';
import type { ServerSelect } from '$lib/server/db/schema';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: typeof authClient.$Infer.Session.session | null;
			user: RouterOutput['getSelf'] | null;
			server: ServerSelect | null;
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
