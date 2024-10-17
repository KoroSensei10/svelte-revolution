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
	<ul class="grid grid-flow-row lg:grid-cols-2 gap-4 text-black">
		{#each sessions as session (session.id)}
			{@const completed = session.completed}
			{@const scenario = session.expand?.scenario}
			{@const imageUrl = pb.files.getUrl(session, session.image)}
			<li
				animate:flip={{ duration: 300 }}
				class="w-full h-fit flex flex-col items-center rounded-lg {completed
					? ' bg-gray-600'
					: 'bg-primary-600'}"
			>
				<a
					tabindex="0"
					class="grid focus:overflow-clip focus:z-50 w-full grid-cols-3 p-4 hover:scale-105 transition-all h-20 rounded-lg place-items-center {completed
						? ' bg-gray-500'
						: 'bg-primary-500'}"
					href={getSessionUrl(session)}
				>
					<h2 class="text-lg font-semibold text-nowrap capitalize justify-self-start">{session.name}</h2>
					<div class="text-center w-full truncate">
						{$t('scenario.scenario')}:
						<span
							data-tip={scenario?.prologue}
							class="italic underline text-pretty font-light cursor-default tooltip tooltip-bottom hover:underline"
							>{scenario?.title}</span
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
				<div class="w-full flex justify-between h-full p-1 pl-2 bg-inherit rounded-b-lg">
					{#if session.expand?.author}
						<div>
							{$t('scenario.author')} : {session.expand?.author?.username}
						</div>
					{/if}
					<div>
						{$t('creationDate')} : {new Date(session.created).toISOString().split('T')[0]}
					</div>
				</div>
			</li>
		{/each}
	</ul>
{:else}
	<div class="text-center">
		{$t('sessions.noSessions')}
	</div>
{/if}
