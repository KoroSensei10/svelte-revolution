<script>
	import { onDestroy } from 'svelte';
	import { t } from 'svelte-i18n';
	import { mainTitle } from '$stores/titles';
	import { page } from '$app/stores';

	mainTitle.set('Babel Révolution - Admin');

	$: activeTab = $page.route.id?.split('/admin/').pop();

	onDestroy(() => {
		mainTitle.set('Babel Révolution');
	});
</script>

<div class="flex flex-col items-center gap-4 py-4">
	<h1 class="text-4xl font-thin text-center text-white first-letter:capitalize">
		{$t('administration')}
	</h1>
	<div role="tablist" class="tabs tabs-lifted">
		<a href="/admin/scenario/create" role="tab" class="tab {activeTab === 'scenario/create' ? 'tab-active' : ''}">
			{$t('create_scenario')}
		</a>
		<a href="/admin/sessions/create" role="tab" class="tab {activeTab === 'sessions/create' ? 'tab-active' : ''}">
			{$t('create_session')}
		</a>
		<a href="/admin/user/create" role="tab" class="tab {activeTab === 'user/create' ? 'tab-active' : ''}">
			{$t('create_user')}
		</a>
	</div>
</div>
<slot></slot>
