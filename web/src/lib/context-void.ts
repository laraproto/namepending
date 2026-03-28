import { createContext } from 'svelte';
import type authClient from './auth-client';

export const [getContextUser, setContextUser] = createContext<
	typeof authClient.$Infer.Session.user | null
>();
