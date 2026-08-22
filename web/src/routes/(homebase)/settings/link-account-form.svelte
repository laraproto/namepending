<script lang="ts">
	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { linkSchema, type LinkSchema } from './schema';
	import { superForm, type SuperValidated, type Infer } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	let {
		data
	}: {
		data: {
			linkForm: SuperValidated<Infer<LinkSchema>>;
		};
	} = $props();

	// svelte-ignore state_referenced_locally
	const form = superForm(data.linkForm, {
		validators: zod4Client(linkSchema)
	});

	const { form: formData, enhance, errors, message } = form;
</script>

<Card.Root class="h-full">
	<Card.Header>
		<Card.Title>Account Link</Card.Title>
		<Card.Description>Associate a player profile with your account</Card.Description>
	</Card.Header>
	<form method="POST" use:enhance action="?/linkAccount">
		<Card.Content class="mb-4">
			{#if $errors._errors || $message}
				<Alert.Root variant={$errors._errors ? 'destructive' : 'default'} class="mb-4">
					{#if $errors._errors}<AlertCircleIcon />
					{:else}
						<CheckCircle2Icon />
					{/if}
					<Alert.Description>
						<ul class="list-inside list-disc text-sm">
							{#each $errors._errors as error (error)}
								<li>{error}</li>
							{/each}
							{#if $message}
								<li>{$message}</li>
							{/if}
						</ul>
					</Alert.Description>
				</Alert.Root>
			{/if}
			<Form.Field {form} name="code">
				<Form.Control>
					{#snippet children({ props })}
						<Input
							{...props}
							type="text"
							placeholder="Enter your code"
							bind:value={$formData.code}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</Card.Content>
		<Card.Footer class="flex w-full justify-end gap-2">
			<Form.Button variant="default" class="w-full lg:w-auto">Link Account</Form.Button>
		</Card.Footer>
	</form>
</Card.Root>
