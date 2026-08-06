<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Card from '$lib/components/ui/card';
	import BansTable from '$lib/components/tables/player-table.svelte';
	import { columns } from '$lib/components/tables/bans-table.js';
	import type { PageProps } from './$types';
	import { banSchema } from '../schema';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { onMount } from 'svelte';
	import Head from '$lib/components/Head.svelte';
	import trpc from '$lib/trpc';
	import type { PaginationState } from '@tanstack/table-core';
	import { hasPermSync } from '$lib/perm-utils';

	let { data }: PageProps = $props();

	let banList = $derived(data.bans);

	const sidebar = Sidebar.useSidebar();

	$effect(() => {
		trpc.panel.moderation.player.getBans
			.query({
				uuid: data.player.uuid,
				page: sidebar.page + 1
			})
			.then((bans) => {
				banList = bans;
			});
	});

	const onPageChange = (pagination: PaginationState) => {
		trpc.panel.moderation.player.getBans
			.query({
				uuid: data.player.uuid,
				page: pagination.pageIndex + 1,
				limit: pagination.pageSize
			})
			.then((bans) => {
				banList = bans;
			});
	};

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	// svelte-ignore state_referenced_locally
	const form = superForm(data.form, {
		validators: zod4Client(banSchema),
		onSubmit({ formData }) {
			formData.set('uuid', data.player.uuid);
		},
		onUpdated() {
			$formData.uuid = data.player.uuid;
		}
	});

	const { form: formData, enhance } = form;

	let dateValue = $state<DateValue | undefined>();
	let timeValue = $state<string>();

	const expiresAtChange = () => {
		if (dateValue && timeValue) {
			const [hours, minutes, seconds] = timeValue.split(':').map(Number);
			const date = new Date(
				dateValue.year,
				dateValue.month - 1,
				dateValue.day,
				hours,
				minutes,
				seconds
			);
			$formData.expiresAt = date;
		}
	};

	let contentRef = $state<HTMLElement | null>(null);

	onMount(() => {
		$formData.uuid = data.player.uuid;
	});
</script>

<Head title={`Player ${data.player.name}'s bans`} />

<div class="container mx-auto my-8 flex flex-col gap-4 px-4">
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
		{#if hasPermSync(sidebar.user, 'CREATE_BANS')}
			<div class="lg:col-span-1">
				<Card.Root>
					<Card.Header>
						<Card.Title>Ban Player</Card.Title>
						<Card.Description>Add a Ban</Card.Description>
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
							{#if !$formData.permanent}
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
													step="1"
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
							<Form.Field {form} name="permanent">
								<div class="flex flex-row items-start space-x-3 py-4">
									<Form.Control>
										{#snippet children({ props })}
											<Checkbox {...props} bind:checked={$formData.permanent} />
											<Form.Label>Permanent?</Form.Label>
										{/snippet}
									</Form.Control>
								</div>

								<Form.FieldErrors />
							</Form.Field>
						</Card.Content>
						<Card.Footer class="flex justify-end">
							<Form.Button>Submit</Form.Button>
						</Card.Footer>
					</form>
				</Card.Root>
			</div>
		{/if}
		<div class="lg:col-span-2">
			<Card.Root>
				<Card.Header>
					<Card.Title>Bans</Card.Title>
					<Card.Description>Bans of {data.player.name}</Card.Description>
				</Card.Header>
				<Card.Content>
					<BansTable
						data={banList.data}
						{columns}
						{onPageChange}
						pageCount={banList.pageCount}
						rowCount={banList.count}
						isManualPagination={true}
					/>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
