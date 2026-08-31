<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import ServersTable from '$lib/components/tables/player-table.svelte';
	import { columns } from '$lib/components/tables/servers-table.js';
	import type { PageProps } from './$types';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import { serverFormSchema } from '../../schema';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Head from '$lib/components/Head.svelte';
	import trpc from '$lib/trpc';
	import type { PaginationState } from '@tanstack/table-core';

	import { URL as URL_FUCK } from '$app/env/public';

	let { data }: PageProps = $props();

	let serverList = $derived(data.servers);

	const sidebar = Sidebar.useSidebar();

	$effect(() => {
		trpc.panel.administration.getServers
			.query({
				query: sidebar.searchValue,
				page: sidebar.page + 1
			})
			.then((servers) => {
				serverList = servers;
			});
	});

	const onPageChange = (pagination: PaginationState) => {
		trpc.panel.administration.getServers
			.query({
				query: sidebar.searchValue,
				page: pagination.pageIndex + 1,
				limit: pagination.pageSize
			})
			.then((servers) => {
				serverList = servers;
			});
	};

	// svelte-ignore state_referenced_locally
	const form = superForm(data.form, {
		validators: zod4Client(serverFormSchema),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				setupDialog = true;
			}
		}
	});

	const { form: formData, enhance, errors, message } = form;

	let setupDialog = $state(false);
</script>

<Head title="Server Management" />

<Dialog.Root bind:open={setupDialog}>
	{@const setupVal = `setupnamepending ${$message ? $message.token : 'no'} ${new URL('/api/graphql', URL_FUCK)}`}
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Setup</Dialog.Title>
		</Dialog.Header>
		<div>
			<Input
				value={setupVal}
				readonly
				class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed"
			/>
		</div>
		<Dialog.Footer>
			<Button
				onclick={async () => {
					await navigator.clipboard.writeText(setupVal);
					setupDialog = false;
				}}
			>
				Copy and Close
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<div class="container mx-auto my-8 flex flex-col gap-4 px-4">
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
		<div class="lg:col-span-1">
			<Card.Root>
				<Card.Header>
					<Card.Title>Add Server</Card.Title>
				</Card.Header>
				<form method="POST" use:enhance>
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
											<li>{$message.message}</li>
										{/if}
									</ul>
								</Alert.Description>
							</Alert.Root>
						{/if}
						<Form.Field {form} name="description">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Description</Form.Label>
									<Input {...props} bind:value={$formData.description} />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</Card.Content>
					<Card.Footer class="flex w-full justify-end gap-2">
						<Form.Button>Submit</Form.Button>
					</Card.Footer>
				</form>
			</Card.Root>
		</div>
		<div class="lg:col-span-2">
			<Card.Root>
				<Card.Header>
					<Card.Title>Servers</Card.Title>
				</Card.Header>
				<Card.Content>
					<ServersTable
						data={serverList.data}
						{columns}
						{onPageChange}
						pageCount={serverList.pageCount}
						rowCount={serverList.count}
						isManualPagination={true}
					/>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
