<script lang="ts">
	import toast from 'svelte-french-toast';
	import type { ActionData } from './$types';
	import EndForm from '../../../../components/form/EndForm.svelte';
	import { enhance } from '$app/forms';

	export let form: ActionData;
	export let data;

	$: form?.success && toast.success('Scénario créé avec succès', { duration: 5000, position: 'bottom-center' });
</script>

<div class="h-screen flex flex-col items-center p-4">
	<h1 class="p-4 text-3xl font-bold">Créer un nouveau scénario</h1>
	<form
		method="POST"
		action="?/createScenario"
		use:enhance
		class="flex flex-col border rounded-lg text-center p-4 gap-4 shadow-md md:w-5/6 w-full"
	>
		<!--  -->
		<div class="border flex flex-col rounded-lg p-2 gap-2">
			<label for="title" class="text-sm font-medium">Titre</label>
			<input
				required
				name="title"
				class="w-full p-4 border rounded-lg text-sm focus:border-blue-500
					focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
				placeholder="Votre super Scénario"
			/>
			<label for="prologue" class="text-sm font-medium">Prologue</label>
			<textarea
				required
				name="prologue"
				class="w-full p-4 border rounded-lg text-sm focus:border-blue-500
					focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
				rows="3"
				placeholder="La nuit était sombre..."
			></textarea>
			<div class="flex flex-nowrap">
				<div class="flex gap-4 justify-around w-full">
					{#each data.lang as lang}
						<button type="button" class="w-full has-[:checked]:bg-gray-200 border rounded-lg">
							<label class="flex p-2 w-full text-sm" for="lang-{lang}">
								<input
									id="lang-{lang}"
									type="radio"
									name="lang"
									class=""
									checked={lang === 'fr'}
									value={lang}
								/>
								<span class="text-sm p-2 uppercase">{lang}</span>
							</label>
						</button>
					{/each}
				</div>
			</div>
		</div>
		<!--  -->
		<div class="border rounded-lg p-2">
			<label for="firstNodeTitle" class="block text-sm font-medium mb-2">Titre du premier noeud</label>
			<input
				required
				name="firstNodeTitle"
				class="py-3 px-4 block w-full border rounded-lg text-sm focus:border-blue-500
					focus:ring-blue-500 disabled:opacity-50"
				placeholder="Votre super titre"
			/>
			<label for="firstNodeText" class="block text-sm font-medium mb-2">Texte du premier noeud</label>
			<textarea
				required
				name="firstNodeText"
				class="py-3 px-4 block w-full border rounded-lg text-sm focus:border-blue-500
					focus:ring-blue-500 disabled:opacity-50"
				rows="3"
				placeholder="ayayaya"
			></textarea>
		</div>
		<!--  -->
		<div class="border rounded-lg p-4">
			<label for="ends" class="">Fin(s)</label>
			<EndForm />
		</div>
		<!--  -->
		<button
			type="submit"
			class="p-4 inline-flex self-center text-sm font-medium rounded-lg border
				border-blue-600 text-blue-600 hover:border-blue-800 hover:text-blue-800 focus:outline-none
				focus:border-blue-800 focus:text-blue-800 disabled:opacity-50"
		>
			Créer le scénario
		</button>
	</form>
</div>

<style lang="postcss">
	label {
		@apply text-sm font-bold;
	}
</style>
