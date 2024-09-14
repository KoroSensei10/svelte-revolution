<script lang="ts">
	import toast from 'svelte-french-toast';
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';

	export let form: ActionData;
	export let data: PageData;

	let theForm: HTMLFormElement;
	let validForm = false;

	$: validForm;

	$: form?.success && toast.success('Session créée avec succès', { duration: 5000, position: 'bottom-center' });
</script>

<div class="h-screen flex flex-col items-center">
	<h1 class="p-4 text-3xl font-bold">Créer une nouvelle session</h1>
	<form
		action="?/createSession"
		method="POST"
		bind:this={theForm}
		on:input={() => (validForm = theForm?.checkValidity())}
		use:enhance
		class="flex flex-col border-t text-center p-4 gap-4 shadow-md"
	>
		<div class="flex gap-4">
			<div class="w-full">
				<div>
					<label for={'name'} class="text-lg font-thin">Nom de la session</label>
					<input
						required
						name={'name'}
						placeholder="Votre nouvelle session"
						class="w-full p-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
					/>
				</div>
			</div>
			<div>
				<label for={'author'} class="text-lg font-thin">Auteur</label>
				<input
					required
					name={'author'}
					placeholder="Auteur"
					class="w-full p-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
				/>
			</div>
		</div>
		<div class="flex flex-col p-4 gap-4">
			<label for="scenarioId"> Sélectionner un scénario </label>
			<select name="scenarioId" class="appearance-none border-b p-4 focus-within:bg-transparent" required>
				<option disabled>Choisir un scénario</option>
				{#each data.scenarios as scenario}
					<option value={scenario.id}>{scenario.title}</option>
				{/each}
			</select>
		</div>
		<button
			type="submit"
			disabled={!validForm}
			class="self-center px-4 py-2 text-black bg-white text-lg rounded disabled:cursor-not-allowed ease-linear
				disabled:opacity-50 transition-all"
		>
			Créer la session
		</button>
	</form>

	{#if form?.success}
		<a
			class="self-center mt-4 px-4 py-2 text-white border text-lg font-light rounded"
			href="/sessions/{form?.session?.id}"
		>
			Aller à la session</a
		>
	{/if}
</div>
