<script lang="ts">
	import MultiInput from './MultInput.svelte';

	export let props: {
		name: string;
		title: string;
		placeholderTitle: string;
		placeholderText: string;
	};

	export let values: { title: string; text: string }[] = [{ title: '', text: '' }];
</script>

<div class="flex flex-col">
	<div class="pb-4">
		{#each values as end, i (end)}
			<div class="flex flex-col">
				<MultiInput
					props={{
						name: props.name,
						title: props.title,
						titleName: `${props.title} ${i + 1} - Titre`,
						textName: `${props.title} ${i + 1} - Texte`,
						placeholderTitle: props.placeholderTitle,
						placeholderText: props.placeholderText
					}}
				/>
				<button
					type="button"
					disabled={values.length <= 1}
					class="border rounded py-2 px-4 self-start text-white {values.length <= 1
						? 'opacity-50 cursor-not-allowed'
						: ''}"
					on:click={() => (values = values.filter((_, index) => index !== i))}
				>
					Supprimer | {props.title} <span class="font-bold">#{i + 1}</span>
				</button>
			</div>
		{/each}
	</div>
	<button
		disabled={values.length === 5}
		type="button"
		class="border self-end py-2 px-4 rounded bg-white text-black {values.length === 5
			? 'opacity-50 cursor-not-allowed'
			: ''}"
		on:click={() => (values = [...values, { title: '', text: '' }])}
	>
		Ajouter
	</button>
</div>
