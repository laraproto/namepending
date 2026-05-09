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
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { onMount } from 'svelte';
	import Head from '$lib/components/Head.svelte';
	import trpc from '$lib/trpc-client';
	import type { PaginationState } from '@tanstack/table-core';

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

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	const form = superForm(data.form, {
		validators: zod4Client(warnSchema),
		onSubmit({ formData }) {
			formData.set('uuid', data.player.uuid);
		},
		onUpdated() {
			$formData.uuid = data.player.uuid;
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

	let dateValue = $state<DateValue | undefined>();
	let timeValue = $state<string>();

	const expiresAtChange = () => {
		if (dateValue && timeValue) {
			const [hours, minutes] = timeValue.split(':').map(Number);
			const date = new Date(dateValue.year, dateValue.month - 1, dateValue.day, hours, minutes);
			$formData.expiresAt = date;
		}
	};

	let contentRef = $state<HTMLElement | null>(null);

	onMount(() => {
		if (!$formData.uuid) {
			$formData.uuid = data.player.uuid;
		}
	});
</script>

<Head title={`Player ${data.player.name}'s warns`} />

<div class="container mx-auto my-8 flex flex-col gap-4 px-4">
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
		<div class="lg:col-span-1">
			<Card.Root>
				<Card.Header>
					<Card.Title>Warn Player</Card.Title>
					<Card.Description>Add a Warning</Card.Description>
				</Card.Header>
				<form method="POST" use:enhance>
					<Card.Content>
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
							<Form.Field {form} name="expiresAt">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Expiry</Form.Label>
										<div class="flex flex-row gap-2">
											<Popover.Root>
												<Popover.Trigger
													{...props}
													class={cn(
														buttonVariants({
															variant: 'outline',
															class: 'w-40 justify-start text-left font-normal'
														}),
														!dateValue && 'text-muted-foreground'
													)}
												>
													<CalendarIcon />
													{dateValue
														? df.format(dateValue.toDate(getLocalTimeZone()))
														: 'Pick a date'}
												</Popover.Trigger>
												<Popover.Content bind:ref={contentRef} class="w-auto p-0">
													<Calendar
														type="single"
														bind:value={dateValue}
														onchange={expiresAtChange}
													/>
												</Popover.Content>
											</Popover.Root>
											<Input
												type="time"
												class="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
												bind:value={timeValue}
												onchange={expiresAtChange}
											/>
										</div>

										<Form.FieldErrors />
										<Input hidden value={$formData.expiresAt} name={props.name} />
									{/snippet}
								</Form.Control>
							</Form.Field>
						{/if}
					</Card.Content>
					<Card.Footer class="flex justify-end">
						<Form.Button>Submit</Form.Button>
					</Card.Footer>
				</form>
			</Card.Root>
		</div>
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
