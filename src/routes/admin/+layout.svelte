<script>
	import { onDestroy } from 'svelte';
	import { t } from 'svelte-i18n';
	import { mainTitle } from '$stores/titles';
	import { page } from '$app/stores';

	mainTitle.set('Admin');

	$: activeTab = $page.route.id?.split('/admin/').pop();

	onDestroy(() => {
		mainTitle.set('Babel Révolution');
	});
</script>

<div class="flex flex-col items-center gap-4 py-4">
	<a href="/admin" class="text-4xl font-thin text-center text-white first-letter:capitalize">
		{$t('administration')}
	</a>
	<!-- <div role="tablist" class="tabs tabs-lifted">
		<a
			href="/admin/scenario/create"
			role="tab"
			class="tab {activeTab === 'scenario/create' ? 'tab-active' : 'text-white'}"
		>
			{$t('createScenario')}
		</a>
		<a
			href="/admin/sessions/create"
			role="tab"
			class="tab {activeTab === 'sessions/create' ? 'tab-active' : 'text-white'}"
		>
			{$t('sessions.createSession')}
		</a>
		<a href="/admin/user/create" role="tab" class="tab {activeTab === 'user/create' ? 'tab-active' : 'text-white'}">
			{$t('createUser')}
		</a>
	</div> -->
</div>
<slot></slot>
