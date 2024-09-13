<script lang="ts">
	import toast from 'svelte-french-toast';
	import type { ActionData } from './$types';
	import DoubleInput from '../../../../components/form/DoubleInput.svelte';
	import Stepper from '../../../../components/form/Stepper.svelte';

	export let form: ActionData;
	export let data;

	let currentStep = 3;
	let theForm: HTMLFormElement;

	const steps = ['Essentiels', 'Premier Noeud', 'Evénement(s)', 'Fin(s)'];

	$: form?.success && toast.success('Scénario créé avec succès', { duration: 3000, position: 'bottom-center' });

	let validForm = false;
	function checkValidity() {
		validForm = theForm?.checkValidity();
	}
</script>

<div class="h-screen flex flex-col items-center">
	<h1 class="p-4 text-3xl font-bold">Nouveau scénario</h1>
	<form
		bind:this={theForm}
		on:input={() => checkValidity()}
		method="POST"
		action="?/createScenario"
		class="flex flex-col p-4 border-t text-center gap-4 md:w-4/6 w-full"
	>
		<Stepper {currentStep} {steps}>
			<!-- Step 1  -->
			<div slot="step-1" class="flex flex-col p-2 gap-4">
				<label for="title" class="text-xl font-thin">Titre</label>
				<input
					required
					name="title"
					class="w-full p-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
					placeholder="Votre super Scénario"
				/>
				<label for="prologue" class="text-xl font-thin">Prologue</label>
				<textarea
					required
					name="prologue"
					class="w-full p-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
					rows="3"
					placeholder="La nuit était sombre..."
				></textarea>
				<div class="flex gap-4 justify-center">
					{#each data.lang as lang}
						<button
							type="button"
							class="apparence-none has-[:checked]:bg-white has-[:checked]:text-black
								border rounded-lg"
						>
							<label class="flex flex-col" for="lang-{lang}">
								<span class="uppercase cursor-pointer p-4 px-5">{lang}</span>
								<input
									id="lang-{lang}"
									type="radio"
									name="lang"
									class="collapse w-0 h-0"
									checked={lang === 'fr'}
									value={lang}
								/>
							</label>
						</button>
					{/each}
				</div>
			</div>
			<!--  -->
			<div slot="step-2" class="flex flex-col p-2 gap-4">
				<label for="firstNodeTitle" class="text-xl font-thin">Titre du premier noeud</label>
				<input
					required
					name="firstNodeTitle"
					class="w-full p-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
					placeholder="Votre super titre"
				/>
				<label for="firstNodeText" class="text-xl font-thin">Texte du premier noeud</label>
				<textarea
					required
					name="firstNodeText"
					class="w-full p-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
					rows="3"
					placeholder="ayayaya"
				></textarea>
			</div>
			<!-- Evenements -->
			<div slot="step-3" class="flex flex-col p-2 gap-4">
				<span class="text-xl font-thin border-b pb-2">Evenement(s)</span>
				<DoubleInput
					props={{
						name: 'event',
						title: 'Evénement',
						placeholderTitle: "Titre de l'événement",
						placeholderText: "Texte de l'événement"
					}}
				/>
			</div>
			<!-- Fins -->
			<div slot="step-4" class="flex flex-col p-2 gap-4">
				<span class="text-xl font-thin border-b pb-2">Fin(s)</span>
				<DoubleInput
					props={{
						name: 'end',
						title: 'Fin',
						placeholderTitle: 'Titre de la fin',
						placeholderText: 'Texte de la fin'
					}}
				/>
			</div>
		</Stepper>
		<!--  -->
		<button
			type="submit"
			disabled={!validForm}
			class="p-4 inline-flex self-center text-sm font-bold rounded border-2 disabled:cursor-not-allowed disabled:opacity-50"
		>
			Créer le scénario
		</button>
	</form>
</div>
