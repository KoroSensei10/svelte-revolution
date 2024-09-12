<script lang="ts">
	import toast from 'svelte-french-toast';
	import type { ActionData, PageData } from './$types';

	export let form: ActionData;

	$: form?.success &&
		toast.success('Scénario créé avec succès', { duration: 5000, position: 'bottom-center' });
</script>

<div class="h-screen flex flex-col items-center p-4">
	<h1 class="p-4 text-3xl font-bold">Create a new scenario</h1>
	<form
		class="flex flex-col border rounded-lg text-center p-4 gap-4 shadow-md"
		method="POST"
		action="?/createScenario"
	>
		<label>
			Titre du scénario
			<input name="title" class="border rounded-lg" type="string" required />
		</label>
		<label>
			Ecrivez un prologue
			<textarea name="prologue" class="border rounded-lg" required></textarea>
		</label>
		<button
			class="border rounded-lg bg-blue-400 p-4 hover:bg-blue-500 hover:shadow-inner"
			type="submit"
		>
			Créer le scénario
		</button>
	</form>
</div>
