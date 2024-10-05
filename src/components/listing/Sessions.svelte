<script lang="ts">
	import { t } from 'svelte-i18n';
	import { pb } from '$lib/pocketbase';
	import graphe1 from '$lib/assets/graphe1.png';

	import type { Session } from '$types/pocketBase/TableTypes';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';

	interface Props {
		sessions: Session[];
		admin?: boolean;
	}
	let { sessions, admin = false }: Props = $props();

	sessions = sessions?.sort((a) => (a.completed ? 1 : -1));

	function getSessionUrl(session: Session) {
		return `/sessions/${session.slug}?${admin ? 'admin=true' : ''}`;
	}

	function completedSessionsFilter(e: Event) {
		// @ts-expect-error checked is a valid property
		if (e.target?.checked) {
			sessions = sessions?.sort((a) => (a.completed ? 1 : -1));
		} else {
			sessions = sessions?.sort((a) => (a.completed ? -1 : 1));
		}
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
				sessions = [...sessions, record];
			}
		});
	});
</script>

{#if sessions?.length}
	<label>
		<input type="checkbox" checked onchange={completedSessionsFilter} />
		{$t('sessions.sortByNotCompleted')}
	</label>
	<ul class="flex flex-col gap-4 p-4 pt-0 text-black sm:w-2/3">
		{#each sessions as session (session.id)}
			{@const scenario = session.expand?.scenario}
			{@const imageUrl = pb.files.getUrl(session, session.image)}
			<li
				animate:flip={{ duration: 300 }}
				class="w-full rounded-lg {session.completed ? 'opacity-80 bg-gray-500' : 'bg-primary-300'} h-fit"
			>
				<a
					class="grid w-full grid-cols-3 p-4 transition-all rounded-lg place-items-center hover:px-2 hover:bg-primary-400"
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
					<figure class="w-12 p-0 justify-self-end">
						<img
							class="rounded-lg"
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
