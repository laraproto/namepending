<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import SuperDebug from 'sveltekit-superforms/SuperDebug.svelte';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { gameGroupFormSchema, type GameGroupFormSchema } from '../../schema';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	let {
		open = false,
		formVal
	}: {
		open?: boolean;
		formVal: SuperValidated<Infer<GameGroupFormSchema>>;
	} = $props();

	// svelte-ignore state_referenced_locally
	const form = superForm(formVal, {
		validators: zod4Client(gameGroupFormSchema),
		onSubmit() {
			console.log('Form submitted with values:', form.form);
		}
	});

	const { form: formData, enhance, errors, message } = form;
</script>

<Dialog.Root {open}>
	<Dialog.Content class="">
		<form method="POST" use:enhance action="?/gameGroup">
			<Dialog.Header>
				<Dialog.Title>Edit game role</Dialog.Title>
				<Dialog.Description>
					Make changes to your game role here. Click save when you&apos;re done.
				</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4">
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
			</div>
			<div class="grid gap-4">
				<div class="grid gap-3">
					<Form.Field {form} name="name">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Name</Form.Label>
								<Input {...props} bind:value={$formData.name} />
							{/snippet}
						</Form.Control>
						<Form.Description>Role name.</Form.Description>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="grid gap-3">
					<Form.Field {form} name="description">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Description</Form.Label>
								<Input {...props} bind:value={$formData.description} />
							{/snippet}
						</Form.Control>
						<Form.Description>Role description.</Form.Description>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="grid gap-3">
					<SuperDebug data={$formData} />
				</div>
			</div>
			<Dialog.Footer>
				<Dialog.Close type="button" class={buttonVariants({ variant: 'outline' })}>
					Cancel
				</Dialog.Close>
				<Button type="submit" formaction="?/gameGroup">Save changes</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
