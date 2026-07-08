<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { registerSchema, type RegisterSchema } from '../schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { type ComponentProps } from 'svelte';
	import authClient from '$lib/auth-client';
	import { page } from '$app/state';

	let {
		data,
		...restProps
	}: ComponentProps<typeof Card.Root> & { data: { form: SuperValidated<Infer<RegisterSchema>> } } =
		$props();

	const form = $derived.by(() =>
		superForm(data.form, {
			validators: zod4Client(registerSchema)
		})
	);

	const { form: formData, enhance, errors } = $derived(form);
</script>

<div class="w-full max-w-sm">
	<Card.Root {...restProps}>
		<Card.Header>
			<Card.Title>Create an account</Card.Title>
			<Card.Description>Enter your information below to create your account</Card.Description>
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
					<Form.Field {form} name="name">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Username</Form.Label>
								<Input {...props} bind:value={$formData.name} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
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
					<Form.Field {form} name="passwordConfirmation">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Confirm Password</Form.Label>
								<Input type="password" {...props} bind:value={$formData.passwordConfirmation} />
							{/snippet}
						</Form.Control>
						<Form.Description>Please confirm your password.</Form.Description>
						<Form.FieldErrors />
					</Form.Field>
					<Field.Group>
						<Field.Field>
							<Button type="submit">Create Account</Button>
							<Button
								variant="outline"
								type="button"
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
								Sign up with Discord
							</Button>
							<Field.Description class="px-6 text-center">
								Already have an account? <a href={resolve('/auth/login')}>Sign in</a>
							</Field.Description>
						</Field.Field>
					</Field.Group>
				</Field.Group>
			</form>
		</Card.Content>
	</Card.Root>
</div>
