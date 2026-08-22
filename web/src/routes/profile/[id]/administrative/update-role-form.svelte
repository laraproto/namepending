<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { PageProps } from './$types';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { updateRoleSchema, type UpdateRoleSchema } from '../schema';
	import { superForm, type SuperValidated, type Infer } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	let {
		data
	}: {
		data: {
			updateRoleForm: SuperValidated<Infer<UpdateRoleSchema>>;
			roles: PageProps['data']['roles'];
			userProfile: PageProps['data']['userProfile'];
		};
	} = $props();

	const roles = $derived(
		data.roles?.data.map((role) => ({
			value: role.uuid,
			label: role.name
		})) ?? []
	);

	const triggerContent = $derived(roles.find((f) => f.value === $formData.role)?.label ?? 'None');

	// svelte-ignore state_referenced_locally
	const form = superForm(data.updateRoleForm, {
		validators: zod4Client(updateRoleSchema)
	});

	const { form: formData, enhance } = form;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Role Management</Card.Title>
	</Card.Header>
	<form method="POST" use:enhance action="?/updateRole">
		<Card.Content class="flex flex-col items-center">
			<Form.Field {form} name="role">
				<Form.Control>
					{#snippet children({ props })}
						<Select.Root {...props} type="single" bind:value={$formData.role}>
							<Select.Trigger class="w-60">
								{triggerContent}
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									<Select.Label>Roles</Select.Label>
									{#each roles as role (role.value)}
										<Select.Item
											value={role.value}
											label={role.label}
											disabled={role.value === data.userProfile.group?.uuid}
										>
											{role.label}
										</Select.Item>
									{/each}
									<Select.Separator />
									<Select.Item value="none" label="None" disabled={!data.userProfile.group}
										>None</Select.Item
									>
								</Select.Group>
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</Card.Content>
		<Card.Footer class="flex w-full justify-end gap-2">
			<Form.Button disabled={$formData.role === data.userProfile.group?.uuid}>Submit</Form.Button>
		</Card.Footer>
	</form>
</Card.Root>
