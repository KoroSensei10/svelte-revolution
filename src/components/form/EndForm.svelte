<script lang="ts">
	import End from './End.svelte';

	let ends: { title: string; text: string }[] = [{ title: '', text: '' }];
</script>

<div class="flex flex-col border rounded-lg">
	{#each ends as end, i}
		<End
			label={`titre #${i + 1}`}
			value={`text #${i + 1}`}
			bind:title={end.title}
			bind:text={end.text}
			index={i + 1}
		/>
	{/each}
	<div class="flex justify-around">
		<button
			disabled={ends.length <= 1}
			type="button"
			class="py-3 px-4 my-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border
					border-blue-600 text-blue-600 hover:border-blue-800 hover:text-blue-800 focus:outline-none
					focus:border-blue-800 focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
			on:click={() => (ends = ends.slice(0, -1))}
		>
			Supprimer
		</button>
		<button
			disabled={ends.length === 5}
			type="button"
			class="py-3 px-4 my-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border
					border-blue-600 text-blue-600 hover:border-blue-800 hover:text-blue-800 focus:outline-none
					focus:border-blue-800 focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
			on:click={() => (ends = [...ends, { title: '', text: '' }])}
		>
			Ajouter
		</button>
	</div>
</div>
