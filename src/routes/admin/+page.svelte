<script lang="ts">
	import { t } from 'svelte-i18n';
	import Sessions from '$components/listing/Sessions.svelte';
	import type { Session, User } from '$types/pocketBase/TableTypes';

	interface Props {
		data: { sessions: Session[]; user: User; otherSessions: Session[] };
	}
	let { data }: Props = $props();
</script>

<div class="flex flex-col items-center gap-4 py-4">
	<h1 class="text-4xl font-thin text-center first-letter:capitalize">{$t('sessions.yourSessions')}</h1>
	<Sessions sessions={data.sessions} admin={true} />
	{#if data.user.role === 'superAdmin'}
		<h1 class="text-4xl font-thin text-center first-letter:capitalize">{$t('sessions.otherSessions')}</h1>
		<Sessions sessions={data.otherSessions} admin={true} />
	{/if}
</div>
