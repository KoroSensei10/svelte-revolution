<svelte:options runes={true} />

<script lang="ts">
	import { t } from 'svelte-i18n';
	import Sessions from '$components/listing/Sessions.svelte';

	let { data } = $props();
</script>

<div class="flex flex-col items-center gap-4 py-4">
	<h1 class="text-4xl font-thin text-center first-letter:capitalize">{$t('sessions.yourSessions')}</h1>
	<Sessions sessions={data.sessions} admin={true} />
</div>
