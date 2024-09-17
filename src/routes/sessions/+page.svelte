<script lang="ts">
	import graphe1 from '$lib/assets/graphe1.png';
	export let data;
</script>

<div class="flex flex-col gap-4">
	<h1 class="text-4xl font-thin text-center">Sessions</h1>
	<div class="flex flex-col items-center sm:flex-row gap-4 justify-center">
		{#each data.sessions as session}
			{@const scenario = session.expand?.scenario}
			<div class="card border-b rounded-b-none bg-base-100 w-52 shadow-xl">
				<figure>
					<img src={graphe1} alt="Shoes" />
				</figure>
				<div class="card-body p-4">
					<h2 class="capitalize card-title">{session.name}</h2>
					<div>
						Scénario : <span
							data-tip={scenario.prologue}
							class="tooltip tooltip-bottom font-light italic hover:underline cursor-default"
							>{scenario.title}</span
						>
					</div>
					<div class="card-actions justify-end">
						<button class="btn btn-primary"
							><a class="first-letter:capitalize" href="/sessions/{session.slug}"> Rejoindre </a>
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
