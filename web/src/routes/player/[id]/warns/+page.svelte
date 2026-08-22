<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Card from '$lib/components/ui/card';
	import WarnsTable from '$lib/components/tables/player-table.svelte';
	import { columns } from '$lib/components/tables/warns-table.js';
	import type { PageProps } from './$types';
	import { warnSchema } from '../schema';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { onMount } from 'svelte';
	import Head from '$lib/components/Head.svelte';
	import trpc from '$lib/trpc';
	import type { PaginationState } from '@tanstack/table-core';
	import { hasPermSync } from '$lib/perm-utils';

	let { data }: PageProps = $props();

	let warnList = $derived(data.warns);

	const sidebar = Sidebar.useSidebar();

	$effect(() => {
		trpc.panel.moderation.player.getWarns
			.query({
				uuid: data.player.uuid,
				page: sidebar.page + 1
			})
			.then((warns) => {
				warnList = warns;
			});
	});

	const onPageChange = (pagination: PaginationState) => {
		trpc.panel.moderation.player.getWarns
			.query({
				uuid: data.player.uuid,
				page: pagination.pageIndex + 1,
				limit: pagination.pageSize
			})
			.then((warns) => {
				warnList = warns;
			});
	};

	// svelte-ignore state_referenced_locally
	const form = superForm(data.form, {
		validators: zod4Client(warnSchema),
		onSubmit({ formData }) {
			formData.set('uuid', data.player.uuid);
		},
		onUpdated() {
			$formData.uuid = data.player.uuid;
			expiresAtChange();
		}
	});

	const { form: formData, enhance } = form;

	const warnType = [
		{ value: 'tempmajor', label: 'Temporary Major' },
		{
			value: 'tempminor',
			label: 'Temporary Minor'
		},
		{ value: 'major', label: 'Major' },
		{ value: 'minor', label: 'Minor' }
	];

	const triggerContent = $derived(
		warnType.find((f) => f.value === $formData.type)?.label ?? 'Select a type'
	);

	let timeValue = $state<number>(2);
	let timeUnit = $state<'minutes' | 'hours' | 'days' | 'months' | 'years'>('hours');

	const expiresAtChange = () => {
		if (timeValue && timeUnit) {
			const now = new Date();
			let expiresAt: Date;

			switch (timeUnit) {
				case 'minutes':
					expiresAt = new Date(now.getTime() + timeValue * 60 * 1000);
					break;
				case 'hours':
					expiresAt = new Date(now.getTime() + timeValue * 60 * 60 * 1000);
					break;
				case 'days':
					expiresAt = new Date(now.getTime() + timeValue * 24 * 60 * 60 * 1000);
					break;
				case 'months':
					expiresAt = new Date(
						now.getFullYear(),
						now.getMonth() + timeValue,
						now.getDate(),
						now.getHours(),
						now.getMinutes(),
						now.getSeconds()
					);
					break;
				case 'years':
					expiresAt = new Date(
						now.getFullYear() + timeValue,
						now.getMonth(),
						now.getDate(),
						now.getHours(),
						now.getMinutes(),
						now.getSeconds()
					);
					break;
			}

			$formData.expiresAt = expiresAt;
		}
	};

	onMount(() => {
		$formData.uuid = data.player.uuid;
		expiresAtChange();
	});
</script>

<Head title={`Player ${data.player.name}'s warns`} />

<div class="container mx-auto my-8 flex flex-col gap-4 px-4">
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
		{#if hasPermSync(sidebar.user, 'CREATE_WARNINGS')}
			<div class="lg:col-span-1">
				<Card.Root>
					<Card.Header>
						<Card.Title>Warn Player</Card.Title>
						<Card.Description>Add a Warning</Card.Description>
					</Card.Header>
					<form method="POST" use:enhance>
						<Card.Content class="mb-4">
							<Form.Field {form} name="reason">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Reason</Form.Label>
										<Input {...props} bind:value={$formData.reason} />
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="type">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Type</Form.Label>
										<Select.Root type="single" bind:value={$formData.type} name={props.name}>
											<Select.Trigger {...props}>
												{triggerContent}
											</Select.Trigger>
											<Select.Content>
												{#each warnType as type (type.value)}
													<Select.Item value={type.value} label={type.label}>
														{type.label}
													</Select.Item>
												{/each}
											</Select.Content>
										</Select.Root>
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							{#if !($formData.type === 'major' || $formData.type === 'minor')}
								<Form.Field {form} name="expiresAt" class="flex flex-col gap-2">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Expiry</Form.Label>
											<div class="grid grid-cols-2 items-end gap-2">
												<Input
													type="number"
													class="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
													bind:value={timeValue}
													onchange={expiresAtChange}
												/>
												<Select.Root
													type="single"
													bind:value={timeUnit}
													name={props.name}
													onValueChange={expiresAtChange}
												>
													<Select.Trigger {...props} class="w-full">
														{timeUnit.at(0)?.toUpperCase() + timeUnit.slice(1)}
													</Select.Trigger>
													<Select.Content>
														<Select.Item value="minutes" label="Minutes">Minutes</Select.Item>
														<Select.Item value="hours" label="Hours">Hours</Select.Item>
														<Select.Item value="days" label="Days">Days</Select.Item>
														<Select.Item value="months" label="Months">Months</Select.Item>
														<Select.Item value="years" label="Years">Years</Select.Item>
													</Select.Content>
												</Select.Root>
											</div>
											<Form.FieldErrors />
											<Input hidden value={$formData.expiresAt} name={props.name} />
										{/snippet}
									</Form.Control>
								</Form.Field>
							{/if}
						</Card.Content>
						<Card.Footer class="flex w-full justify-end gap-2">
							<Form.Button>Submit</Form.Button>
						</Card.Footer>
					</form>
				</Card.Root>
			</div>
		{/if}
		<div class="lg:col-span-2">
			<Card.Root>
				<Card.Header>
					<Card.Title>Warnings</Card.Title>
					<Card.Description>Warnings of {data.player.name}</Card.Description>
				</Card.Header>
				<Card.Content>
					<WarnsTable
						data={warnList.data}
						{columns}
						{onPageChange}
						pageCount={warnList.pageCount}
						rowCount={warnList.count}
						isManualPagination={true}
					/>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
