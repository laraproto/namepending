<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import SuperDebug from 'sveltekit-superforms/SuperDebug.svelte';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { panelGroupFormSchema, type PanelGroupFormSchema } from '../../schema';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { RoleFlags, type RoleFlagKeys } from '@namepending/shared/user';

	let {
		open = false,
		formVal
	}: {
		open?: boolean;
		formVal: SuperValidated<Infer<PanelGroupFormSchema>>;
	} = $props();

	// svelte-ignore state_referenced_locally
	const form = superForm(formVal, {
		validators: zod4Client(panelGroupFormSchema)
	});

	const { form: formData, enhance, errors, message } = form;
</script>

<Dialog.Root {open}>
	<Dialog.Content>
		<form method="POST" use:enhance action="?/panelGroup">
			<Dialog.Header>
				<Dialog.Title>Edit panel role</Dialog.Title>
				<Dialog.Description>
					Make changes to your panel role here. Click save when you&apos;re done.
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
					<Form.Fieldset {form} name="permissions">
						<Form.Legend>Permissions</Form.Legend>
						<div class="grid grid-cols-4 gap-3">
							{#each Object.keys(RoleFlags) as permission, i (permission)}
								<Form.ElementField
									{form}
									name="permissions[{i}]"
									class="flex items-center space-x-3 rtl:space-x-reverse"
								>
									<Form.Control>
										{#snippet children({ props })}
											<Switch
												{...props}
												onCheckedChange={(checked) => {
													if (checked) {
														$formData.permissions.push(permission as RoleFlagKeys);
													} else {
														$formData.permissions = $formData.permissions.filter(
															(p) => p !== permission
														);
													}
												}}
											/>
											<Form.Label>{permission}</Form.Label>
										{/snippet}
									</Form.Control>
								</Form.ElementField>
							{/each}
						</div>
						<Form.FieldErrors />
					</Form.Fieldset>
				</div>

				<div class="grid gap-3">
					<SuperDebug data={$formData} />
				</div>
			</div>
			<Dialog.Footer>
				<Dialog.Close type="button" class={buttonVariants({ variant: 'outline' })}>
					Cancel
				</Dialog.Close>
				<Button type="submit">Save changes</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
