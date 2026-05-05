<script lang="ts" module>
	import SquareTerminalIcon from '@lucide/svelte/icons/square-terminal';
	import SendIcon from '@lucide/svelte/icons/send';
	import lara from '$lib/assets/lara.png';

	const data = {
		navMain: [
			{
				title: 'Homebase',
				url: '/',
				icon: SquareTerminalIcon,
				isActive: true,
				items: [
					{
						title: 'Dashboard',
						url: '/stats'
					},
					/*{
						title: 'Server Status',
						url: '/status'
					},*/
					{
						title: 'Staff List',
						url: '/staff'
					}
				]
			},
			{
				title: 'Moderation',
				url: '/moderation',
				icon: SquareTerminalIcon,
				isActive: true,
				items: [
					{
						title: 'Warnings',
						url: '/moderation/warnings',
						permRequired: 'VIEW_WARNINGS'
					},
					{
						title: 'Bans',
						url: '/moderation/bans',
						permRequired: 'VIEW_BANS'
					},
					{
						title: 'Player Search',
						url: '/moderation/search',
						permRequired: 'SEARCH_USERS'
					},
					{
						title: 'User Search',
						url: '/moderation/user',
						permRequired: 'SEARCH_USERS'
					}
				]
			}
		],
		navSecondary: [
			{
				title: 'Report Issues with namepending',
				url: 'https://github.com/laraproto/namepending/issues',
				icon: SendIcon
			}
		]
	} satisfies {
		navMain: NavMainProps['items'];
		navSecondary: {
			title: string;
			url: string;
			icon: Component;
			isActive?: boolean;
		}[];
	};
</script>

<script lang="ts">
	import type { Component, ComponentProps } from 'svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import NavMain, { type NavMainProps } from './nav-main.svelte';
	import NavSecondary from './nav-secondary.svelte';
	import NavUser from './nav-user.svelte';
	import { resolve } from '$app/paths';
	import { env } from '$env/dynamic/public';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root
	bind:ref
	class="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
	{...restProps}
>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="lg">
					{#snippet child({ props })}
						<a href={resolve('/')} {...props}>
							<div
								class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
							>
								<img src={lara} class="size-8" alt="logo" />
							</div>
							<div class="grid flex-1 text-start text-lg leading-tight">
								<span class="truncate font-medium">{env.PUBLIC_NAME ?? 'Namepending'}</span>
							</div>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
		<NavSecondary items={data.navSecondary} class="mt-auto" />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser />
	</Sidebar.Footer>
</Sidebar.Root>
