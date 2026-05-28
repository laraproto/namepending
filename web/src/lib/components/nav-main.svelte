<script lang="ts" module>
	export interface NavMainProps {
		items: {
			title: string;
			url: string;
			icon: Component;
			isActive?: boolean;
			permRequired?: PermRequired;
			items?: {
				permRequired?: PermRequired;
				title: string;
				url: string;
			}[];
		}[];
	}
</script>

<script lang="ts">
	import type { Component } from 'svelte';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { hasPermSync, type PermRequired } from '$lib/perm-utils';

	let { items }: NavMainProps = $props();

	const sidebar = Sidebar.useSidebar();

	let filteredItems = $derived.by(() => {
		const mappedItems = items.map((item) => {
			const visibleSubItems = item.items
				? item.items
						.map((subItem) => {
							if (!subItem.permRequired) return subItem;
							return hasPermSync(sidebar.user, subItem.permRequired) ? subItem : null;
						})
						.filter((subItem) => subItem !== null)
				: undefined;

			const isItemVisible =
				(visibleSubItems?.length ?? 0) > 0 ||
				(item.permRequired && hasPermSync(sidebar.user, item.permRequired));

			if (!isItemVisible) return null;

			return {
				...item,
				items: visibleSubItems
			};
		});

		return mappedItems.filter((item) => item !== null);
	});
</script>

<Sidebar.Group>
	<Sidebar.Menu>
		{#each filteredItems as item (item.title)}
			<Collapsible.Root open={item.isActive}>
				{#snippet child({ props })}
					<Sidebar.MenuItem {...props}>
						<Sidebar.MenuButton tooltipContent={item.title}>
							{#snippet child({ props })}
								<!-- eslint-disable-next-line -->
								<a href={item.url} {...props}>
									<item.icon />
									<span>{item.title}</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
						{#if item.items?.length}
							<Collapsible.Trigger>
								{#snippet child({ props })}
									<Sidebar.MenuAction {...props} class="data-[state=open]:rotate-90">
										<ChevronRightIcon />
										<span class="sr-only">Toggle</span>
									</Sidebar.MenuAction>
								{/snippet}
							</Collapsible.Trigger>
							<Collapsible.Content>
								<Sidebar.MenuSub>
									{#each item.items as subItem (subItem.title)}
										<Sidebar.MenuSubItem>
											<Sidebar.MenuSubButton>
												{#snippet child({ props })}
													<!-- eslint-disable-next-line -->
													<a href={subItem.url} {...props}>
														<span>{subItem.title}</span>
													</a>
												{/snippet}
											</Sidebar.MenuSubButton>
										</Sidebar.MenuSubItem>
									{/each}
								</Sidebar.MenuSub>
							</Collapsible.Content>
						{/if}
					</Sidebar.MenuItem>
				{/snippet}
			</Collapsible.Root>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
