<script lang="ts">
	import { t } from 'svelte-i18n';
	import { mainTitle } from '$stores/titles';
	import { onDestroy } from 'svelte';

	export let data;

	$: activeTab = data?.route;

	$: containSessions = activeTab.includes('sessions');

	mainTitle.set('Admin');

	onDestroy(() => {
		mainTitle.set('Babel Révolution');
	});
</script>

{#if !containSessions}
	<div class="flex flex-col items-center gap-4 py-4">
		<a href="/admin" class="text-4xl font-thin text-center text-white first-letter:capitalize">
			{$t('administration')}
		</a>
		<div role="tablist" class="tabs tabs-lifted">
			<a
				href="/admin/scenario/create"
				role="tab"
				class="tab {activeTab === '/admin/scenario/create' ? 'tab-active' : 'text-white'}"
			>
				{$t('createScenario')}
			</a>
			<a
				href="/admin/sessions/create"
				role="tab"
				class="tab {activeTab === '/admin/sessions/create' ? 'tab-active' : 'text-white'}"
			>
				{$t('sessions.createSession')}
			</a>
			<a
				href="/admin/user/create"
				role="tab"
				class="tab {activeTab === '/admin/user/create' ? 'tab-active' : 'text-white'}"
			>
				{$t('createUser')}
			</a>
		</div>
	</div>
{:else}
	<div class="sticky top-0 w-full p-2 text-center uppercase bg-red-600 opacity-40 -z-20">
		<span class="w-full text-white">{$t('admin')}</span>
	</div>
{/if}

<slot />
