<script lang="ts">
	import { t } from 'svelte-i18n';
	import { pb } from '$lib/pocketbase.js';
	import graphe1 from '$lib/assets/graphe1.png';

	export let data;
</script>

<div class="flex flex-col items-center gap-4 py-4">
	<h1 class="text-4xl font-thin text-center first-letter:capitalize">{$t('sessions.yourSessions')}</h1>
	{#if data.sessions.length}
		<ul class="flex flex-col gap-4 p-4 pt-0 text-black sm:w-2/3">
			{#each data.sessions as session (session.id)}
				{@const scenario = session.expand?.scenario}
				{@const imageUrl = pb.files.getUrl(session, session.image)}
				<li class="w-full rounded-lg bg-primary-300 h-fit">
					<a
						class="grid w-full grid-cols-3 p-4 transition-all rounded-lg place-items-center hover:px-2 hover:bg-primary-400"
						href="/admin/sessions/{session.slug}"
					>
						<h2 class="text-lg font-semibold capitalize justify-self-start">{session.name}</h2>
						<div class="text-center">
							{$t('scenario')}:
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
	{/if}
</div>
