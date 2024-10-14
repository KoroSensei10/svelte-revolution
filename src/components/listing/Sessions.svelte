<script lang="ts">
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { t } from 'svelte-i18n';
	import { pb } from '$lib/client/pocketbase';
	import graphe1 from '$lib/assets/graphe1.png';

	import type { Session } from '$types/pocketBase/TableTypes';

	interface Props {
		showFilter?: boolean;
		sessions: Session[];
		admin?: boolean;
	}
	let { sessions, admin = false, showFilter = false }: Props = $props();

	sessions = sessions?.sort((a) => (a.completed ? 1 : -1));

	function getSessionUrl(session: Session) {
		return `/sessions/${session.slug}?${admin ? 'admin=true' : ''}`;
	}

	onMount(async () => {
		// update sessions in realtime when a new session is created
		await pb.collection('Session').subscribe('*', (data) => {
			const record = data.record;
			if (!sessions) {
				sessions = [data.record];
				return;
			}
			const index = sessions?.findIndex((session) => session.id === record.id);
			if (index !== -1) {
				sessions[index] = record;
			} else {
				sessions.push(record);
			}
		});
	});
</script>

{#if sessions?.length}
	{#if showFilter}
		<div></div>
	{/if}
	<ul class="flex flex-col gap-4 text-black sm:w-2/3">
		{#each sessions as session (session.id)}
			{@const scenario = session.expand?.scenario}
			{@const imageUrl = pb.files.getUrl(session, session.image)}
			<li
				animate:flip={{ duration: 300 }}
				class="w-full h-20 flex items-center rounded-lg {session.completed
					? 'opacity-80 bg-gray-500'
					: 'bg-primary-500'}"
			>
				<a
					class="grid w-full grid-cols-3 p-4 transition-all h-full rounded-lg place-items-center hover:bg-primary-300"
					href={getSessionUrl(session)}
				>
					<h2 class="text-lg font-semibold capitalize justify-self-start">{session.name}</h2>
					<div class="text-center">
						{$t('scenario.scenario')}:
						<span
							data-tip={scenario.prologue}
							class="italic font-light cursor-default tooltip tooltip-bottom hover:underline"
							>{scenario.title}</span
						>
					</div>
					<figure class="w-12 h-12 p-0 flex justify-center justify-self-end">
						<img
							class="rounded-lg p-0 h-12 w-12 object-cover"
							src={session.image ? imageUrl : graphe1}
							alt={session.image ?? graphe1}
						/>
					</figure>
				</a>
			</li>
		{/each}
	</ul>
{:else}
	<div class="text-center">
		{$t('sessions.noSessions')}
	</div>
{/if}
