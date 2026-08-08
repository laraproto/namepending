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
	import authClient from '$lib/auth';
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

<div class="w-full gap-6">
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
					<Field.Group class="grid grid-cols-2 gap-4">
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
					</Field.Group>
					<Field.Field>
						<Button type="submit" class="w-full">Create Account</Button>
					</Field.Field>
					<Field.Separator class="*:data-[slot=field-separator-content]:bg-card">
						Or continue with
					</Field.Separator>
					<Field.Field class="grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-4">
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
							<svg
								fill="currentColor"
								color="#5865F2"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
								><path
									d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"
								/></svg
							>
							<span class="sr-only">Sign up with Discord</span>
						</Button>
					</Field.Field>
					<Field.Description class="px-6 text-center">
						Already have an account? <a href={resolve('/auth/login')}>Sign in</a>
					</Field.Description>
				</Field.Group>
			</form>
		</Card.Content>
	</Card.Root>
</div>
