<script lang="ts">
	import BadgeCheckIcon from '@lucide/svelte/icons/badge-check';
	import BellIcon from '@lucide/svelte/icons/bell';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';

	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import Button from './ui/button/button.svelte';
	import { resolve } from '$app/paths';
	import authClient from '$lib/auth-client';

	const sidebar = Sidebar.useSidebar();

	const session = authClient.useSession();
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		{#if $session.data}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Sidebar.MenuButton
							size="lg"
							class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							{...props}
						>
							<Avatar.Root class="size-8 rounded-lg">
								<Avatar.Image src={$session.data?.user.image} alt={$session.data?.user.name} />
								<Avatar.Fallback class="rounded-lg">{$session.data?.user.name}</Avatar.Fallback>
							</Avatar.Root>
							<div class="grid flex-1 text-start text-sm leading-tight">
								<span class="truncate font-medium">{$session.data?.user.name}</span>
							</div>
							<ChevronsUpDownIcon class="ms-auto size-4" />
						</Sidebar.MenuButton>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content
					class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
					side={sidebar.isMobile ? 'bottom' : 'right'}
					align="end"
					sideOffset={4}
				>
					<DropdownMenu.Label class="p-0 font-normal">
						<div class="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
							<Avatar.Root class="size-8 rounded-lg">
								<Avatar.Image src={$session.data?.user.image} alt={$session.data?.user.name} />
								<Avatar.Fallback class="rounded-lg">{$session.data?.user.name}</Avatar.Fallback>
							</Avatar.Root>
							<div class="grid flex-1 text-start text-sm leading-tight">
								<span class="truncate font-medium">{$session.data?.user.name}</span>
							</div>
						</div>
					</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Group>
						<DropdownMenu.Item>
							{#snippet child({ props })}
								<!-- eslint-disable-next-line -->
								<a href="https://youtu.be/dQw4w9WgXcQ" {...props}>
									<SparklesIcon />
									Upgrade to Pro
								</a>
							{/snippet}
						</DropdownMenu.Item>
					</DropdownMenu.Group>
					<DropdownMenu.Separator />
					<DropdownMenu.Group>
						<DropdownMenu.Item>
							<BadgeCheckIcon />
							Account
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<CreditCardIcon />
							Billing
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<BellIcon />
							Notifications
						</DropdownMenu.Item>
					</DropdownMenu.Group>
					<DropdownMenu.Separator />
					<DropdownMenu.Item class="cursor-pointer" onclick={() => authClient.signOut()}>
						<LogOutIcon />
						Log out
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{:else}
			<Sidebar.MenuButton
				size="lg"
				variant="default"
				class="w-full hover:bg-transparent active:bg-transparent"
			>
				<Button
					variant="outline"
					size="sm"
					class="w-full hover:cursor-pointer"
					href={resolve('/auth/login')}>Sign in</Button
				>
			</Sidebar.MenuButton>
		{/if}
	</Sidebar.MenuItem>
</Sidebar.Menu>
