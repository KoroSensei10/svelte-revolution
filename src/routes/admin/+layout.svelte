<script lang="ts">
	import { t } from 'svelte-i18n';
	import { titles } from '$stores/titles/index.svelte.js';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types.js';

	interface Props {
		data: LayoutData;
		children: Snippet;
	}
	let { data, children }: Props = $props();

	let activeTab = $derived(data?.route);

	titles.setMainTitle('Admin');

	const tabs = [
		{ href: '/admin/scenario/create', label: $t('createScenario') },
		{ href: '/admin/sessions/create', label: $t('sessions.createSession') }
	];
	if (data.user?.role === 'superAdmin') {
		tabs.push({ href: '/admin/user/create', label: $t('user.createUser') });
	}
</script>

<div class="flex flex-col items-center gap-4 py-4">
	<a href="/admin" class="text-4xl font-thin text-center text-white hover:text-green-500 first-letter:capitalize">
		{$t('administration')}
	</a>
	<div role="tablist" class="tabs tabs-lifted">
		{#each tabs as tab}
			<a
				href={tab.href}
				role="tab"
				class="tab hover:text-green-500 {activeTab === tab.href ? 'tab-active' : 'text-white'}"
			>
				{tab.label}
			</a>
		{/each}
	</div>
</div>

{@render children()}
