<script lang="ts">
	import toast from 'svelte-french-toast';
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';

	export let form: ActionData;
	export let data: PageData;

	$: form?.success && toast.success('Session créée avec succès', { duration: 5000, position: 'bottom-center' });
</script>

<div class="h-screen flex flex-col items-center">
	<h1 class="p-4 text-3xl font-bold">Create a new session</h1>
	<form
		action="?/createSession"
		method="POST"
		use:enhance
		class="flex flex-col border rounded-lg text-center p-4 gap-4 shadow-md"
	>
		<label>
			Nom de la session
			<input name="name" class="border rounded-lg" type="string" required />
		</label>
		<label>
			Sélectionner un scénario
			<select name="scenarioId" class="border rounded-lg" required>
				<option disabled value="">Choisir un scénario</option>
				{#each data.scenarios as scenario}
					<option value={scenario.id}>{scenario.title}</option>
				{/each}
			</select>
		</label>
		<label>
			Auteur
			<input name="author" class="border rounded-lg" type="string" required />
		</label>
		<button type="submit" class="border rounded-lg bg-blue-400 p-4 hover:bg-blue-500 hover:shadow-inner">
			Créer la session
		</button>
	</form>

	{#if form?.success}
		<a class="border rounded-lg bg-blue-300 hover:bg-blue-400 transition-all" href="/sessions/{form?.session?.id}">
			Aller à la session</a
		>
	{/if}
</div>
