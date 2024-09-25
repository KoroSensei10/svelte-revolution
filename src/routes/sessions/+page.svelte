<script lang="ts">
	import graphe1 from '$lib/assets/graphe1.png';
	import { pb } from '$lib/pocketbase';
	import { t } from 'svelte-i18n';

	export let data;
</script>

<div class="flex flex-col items-center gap-4 py-4">
	<h1 class="text-4xl font-thin text-center first-letter:capitalize">{$t('sessions.sessions')}</h1>
	{#if data.sessions.length}
		<ul class="flex flex-col p-4 pt-0 text-black gap-4 sm:w-2/3">
			{#each data.sessions as session (session.id)}
				{@const scenario = session.expand?.scenario}
				{@const imageUrl = pb.files.getUrl(session, session.image)}
				<li class="rounded-lg bg-primary-300 w-full h-fit">
					<a
						class="rounded-lg grid grid-cols-3 p-4 place-items-center w-full transition-all hover:px-2 hover:bg-primary-400"
						href="/sessions/{session.slug}"
					>
						<h2 class="capitalize text-lg font-semibold justify-self-start">{session.name}</h2>
						<div class="text-center">
							{$t('scenario')}:
							<span
								data-tip={scenario.prologue}
								class="italic font-light cursor-default tooltip tooltip-bottom hover:underline"
								>{scenario.title}</span
							>
						</div>
						<figure class="w-12 justify-self-end p-0">
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
	{/if}
</div>
