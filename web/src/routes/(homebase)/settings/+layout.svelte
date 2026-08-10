<script lang="ts">
	import type { LayoutProps } from './$types';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import { onDestroy } from 'svelte';
	import { resolve } from '$app/paths';
	import { hasPermSync } from '$lib/perm-utils';

	const sidebar = Sidebar.useSidebar();

	let { children }: LayoutProps = $props();

	$effect(() => {
		sidebar.setToolbar(profileToolbar);
	});

	onDestroy(() => {
		sidebar.setToolbar(null, null);
	});
</script>

{#snippet profileToolbar()}
	<div class="flex w-full items-center gap-2">
		<NavigationMenu.Root>
			<NavigationMenu.List>
				<NavigationMenu.Item>
					<NavigationMenu.Link>
						{#snippet child()}
							<a href={resolve('/settings')} class={navigationMenuTriggerStyle()}>Preferences</a>
						{/snippet}
					</NavigationMenu.Link>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Link>
						{#snippet child()}
							<a href={resolve('/settings/connections')} class={navigationMenuTriggerStyle()}
								>Connections</a
							>
						{/snippet}
					</NavigationMenu.Link>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Link>
						{#snippet child()}
							<a href={resolve('/settings/themes')} class={navigationMenuTriggerStyle()}>Themes</a>
						{/snippet}
					</NavigationMenu.Link>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	</div>
{/snippet}

{@render children?.()}
