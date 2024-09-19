<script lang="ts">
	import graphe1 from '$lib/assets/graphe1.png';
	import { t } from 'svelte-i18n';

	export let data;
</script>

<div class="flex flex-col gap-4 py-4">
	<h1 class="text-4xl font-thin text-center first-letter:capitalize text-white">{$t('sessions')}</h1>
	{#if data.sessions.length}
		<ul class="flex flex-col items-center sm:flex-row gap-4 justify-center">
			{#each data.sessions as session (session.id)}
				{@const scenario = session.expand?.scenario}
				<li class="card border-b rounded-b-none bg-base-100 w-52 shadow-xl">
					<figure>
						<imgsrc={graphe1} alt={session.image ?? graphe1} />
					</figure>
					<div class="card-body p-4 bg-gray-900 text-white">
						<h2 class="capitalize card-title">{session.name}</h2>
						<div>
							{$t('scenario')}:
							<span
								data-tip={scenario.prologue}
								class="tooltip tooltip-bottom font-light italic hover:underline cursor-default"
								>{scenario.title}</span
							>
						</div>
						<div class="card-actions justify-end">
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
