<script lang="ts">
	import type { LayoutProps } from './$types';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { resolve } from '$app/paths';
	import { hasPermSync } from '$lib/perm-utils';

	const sidebar = Sidebar.useSidebar();

	let { data, children }: LayoutProps = $props();

	onMount(() => {
		if (data.userProfile) {
			sidebar.setToolbar(profileToolbar, data.userProfile);
		}
	});

	onDestroy(() => {
		sidebar.setToolbar(null, null);
	});
</script>

{#snippet profileToolbar(user: NonNullable<LayoutProps['data']['userProfile']>)}
	<div class="flex w-full items-center gap-2">
		<NavigationMenu.Root>
			<NavigationMenu.List>
				<NavigationMenu.Item>
					<NavigationMenu.Link>
						{#snippet child()}
							<a
								href={resolve('/profile/[id]', {
									id: user.id
								})}
								class={navigationMenuTriggerStyle()}>Overview</a
							>
						{/snippet}
					</NavigationMenu.Link>
				</NavigationMenu.Item>
				{#if hasPermSync(sidebar.user, 'VIEW_ROLES') || sidebar.user?.id === user.id}
					<NavigationMenu.Item>
						<NavigationMenu.Link>
							{#snippet child()}
								<a
									href={resolve('/profile/[id]/administrative', {
										id: user.id
									})}
									class={navigationMenuTriggerStyle()}>Administrative</a
								>
							{/snippet}
						</NavigationMenu.Link>
					</NavigationMenu.Item>
				{/if}
			</NavigationMenu.List>
		</NavigationMenu.Root>
	</div>
{/snippet}

{@render children?.()}
