<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import SuperDebug from 'sveltekit-superforms/SuperDebug.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { gameGroupFormSchema } from '../../../../schema';
	import { type PageProps } from './$types';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import { Permissions, type Permission } from '@namepending/shared/sl';
	import { resolve } from '$app/paths';

	let { data }: PageProps = $props();

	// svelte-ignore state_referenced_locally
	const form = superForm(data.gameGroupForm, {
		validators: zod4Client(gameGroupFormSchema),
		dataType: 'json'
	});

	const { form: formData, enhance, message, errors } = form;
</script>

<div class="mx-auto w-full px-4">
	<Card.Root>
		<Card.Header>
			<Card.Title class="text-2xl">Edit game role</Card.Title>
			<Card.Description
				>Make changes to your game role here. Click save when you&apos;re done.</Card.Description
			>
		</Card.Header>
		<form use:enhance method="POST">
			<Card.Content>
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
							{#each Permissions as permission, i (permission)}
								<Form.ElementField
									{form}
									name="permissions[{i}]"
									class="flex items-center space-x-3 rtl:space-x-reverse"
								>
									<Form.Control>
										{#snippet children({ props })}
											<Switch
												{...props}
												checked={$formData.permissions.includes(permission as Permission)}
												onCheckedChange={(checked) => {
													if (checked) {
														$formData.permissions[$formData.permissions.length] =
															permission as Permission;
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
			</Card.Content>
			<Card.Footer>
				<Button type="button" href={resolve('/admin/roles')} variant="outline">Cancel</Button>
				<Button type="submit">Save changes</Button>
			</Card.Footer>
		</form>
	</Card.Root>
</div>
