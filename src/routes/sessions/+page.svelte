<script lang="ts">
	import { t } from 'svelte-i18n';
	import Sessions from '$components/listing/Sessions.svelte';

	export let data;
</script>

<div class="flex flex-col items-center gap-4 py-4">
	<h1 class="text-4xl font-thin text-center first-letter:capitalize">{$t('sessions.sessions')}</h1>
	<Sessions sessions={data.sessions} />
</div>
