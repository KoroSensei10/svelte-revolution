<script lang="ts">
	import graphe1 from '$lib/assets/graphe1.png';
	import { t } from 'svelte-i18n';

	export let data;
</script>

<div class="flex flex-col gap-4 py-4">
	<h1 class="text-4xl font-thin text-center text-white first-letter:capitalize">{$t('sessions')}</h1>
	{#if data.sessions.length}
		<ul class="flex flex-col items-center justify-center gap-4 sm:flex-row">
			{#each data.sessions as session (session.id)}
				{@const scenario = session.expand?.scenario}
				<li class="border-b rounded-b-none shadow-xl card bg-base-100 w-52">
					<figure>
						<img src={graphe1} alt={session.image ?? graphe1} />
					</figure>
					<div class="p-4 text-white bg-gray-900 card-body">
						<h2 class="capitalize card-title">{session.name}</h2>
						<div>
							{$t('scenario')}:
							<span
								data-tip={scenario.prologue}
								class="italic font-light cursor-default tooltip tooltip-bottom hover:underline"
								>{scenario.title}</span
							>
						</div>
						<div class="justify-end card-actions">
							<a
								class="btn btn-primary first-letter:capitalize hover:text-white"
								href="/sessions/{session.slug}"
							>
								{$t('join')}</a
							>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>
