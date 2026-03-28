<script lang="ts" module>
	import SquareTerminalIcon from '@lucide/svelte/icons/square-terminal';
	import { SiDiscord } from '@icons-pack/svelte-simple-icons';
	import SendIcon from '@lucide/svelte/icons/send';
	import CommandIcon from '@lucide/svelte/icons/command';

	const session = authClient.useSession();

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
					{
						title: 'Server Status',
						url: '/status'
					},
					{
						title: 'Staff List',
						url: '/staff'
					}
				]
			}
		],
		navSecondary: [
			{
				title: 'Discord',
				url: '#',
				icon: SiDiscord
			},
			{
				title: 'Send feedback',
				url: '#',
				icon: SendIcon
			}
		]
	};
</script>

<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import NavMain from './nav-main.svelte';
	import NavSecondary from './nav-secondary.svelte';
	import NavUser from './nav-user.svelte';
	import { resolve } from '$app/paths';
	import authClient from '$lib/auth-client';

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
								<CommandIcon class="size-4" />
							</div>
							<div class="grid flex-1 text-start text-sm leading-tight">
								<span class="truncate font-medium">Placeholder af</span>
								<span class="truncate text-xs">Meow</span>
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
		<NavUser user={$session.data?.user} />
	</Sidebar.Footer>
</Sidebar.Root>
