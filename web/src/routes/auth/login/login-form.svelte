<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { loginSchema, type LoginSchema } from '../schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { type ComponentProps } from 'svelte';
	import authClient from '$lib/auth-client';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { page } from '$app/state';

	let {
		data,
		...restProps
	}: ComponentProps<typeof Card.Root> & { data: { form: SuperValidated<Infer<LoginSchema>> } } =
		$props();

	const form = $derived.by(() =>
		superForm(data.form, {
			validators: zod4Client(loginSchema)
		})
	);

	const { form: formData, enhance, errors } = $derived(form);

	const sidebar = Sidebar.useSidebar();

	const returnUrl = $derived(
		`${page.url.pathname}?q=${encodeURIComponent(sidebar.searchValue)}&page=${sidebar.page}`
	);
</script>

<Card.Root class="mx-auto w-full max-w-sm" {...restProps}>
	<Card.Header>
		<Card.Title class="text-2xl">Login</Card.Title>
		<Card.Description>Enter your email below to login to your account</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if $errors._errors}
			<Alert.Root variant="destructive" class="mb-4">
				<AlertCircleIcon />
				<Alert.Title>Your form has errors</Alert.Title>
				<Alert.Description>
					<ul class="list-inside list-disc text-sm">
						{#each $errors._errors as error (error)}
							<li>{error}</li>
						{/each}
					</ul>
				</Alert.Description>
			</Alert.Root>
		{/if}
		<form method="POST" use:enhance>
			<Field.Group>
				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Email</Form.Label>
							<Input {...props} bind:value={$formData.email} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Password</Form.Label>
							<Input type="password" {...props} bind:value={$formData.password} />
						{/snippet}
					</Form.Control>
					<Form.Description>Password must be at least 8 characters long.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
				<Field.Field>
					<Button type="submit" class="w-full">Login</Button>
					<Button
						variant="outline"
						class="w-full"
						onclick={() => {
							const url = new URL(
								decodeURIComponent(page.url.searchParams.get('return') || '/'),
								page.url.origin
							);
							url.searchParams.set('code', 'logged-in');
							authClient.signIn.social({
								provider: 'discord',
								callbackURL: url.toString()
							});
						}}
					>
						Login with Discord
					</Button>
					<Field.Description class="text-center">
						Don't have an account? <a href={resolve('/auth/register')}>Sign up</a>
					</Field.Description>
				</Field.Field>
			</Field.Group>
		</form>
	</Card.Content>
</Card.Root>
