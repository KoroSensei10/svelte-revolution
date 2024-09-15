<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let steps: string[] = []; // Liste des étapes
	export let currentStep: number = 2; // Étape actuelle

	function buildUrl(step: number) {
		const url = new URL(location.href);
		url.searchParams.set('step', `${step}`);
		return url.toString();
	}

	function next() {
		if (currentStep < steps.length - 1) {
			currentStep += 1;
			goto(buildUrl(currentStep));
		}
	}

	function prev() {
		if (currentStep > 0) {
			currentStep -= 1;
			goto(buildUrl(currentStep));
		}
	}

	function handleClick(index: number) {
		if (index < currentStep) {
			currentStep = index;
		}
	}

	onMount(() => {
		const params = new URLSearchParams(location.search);
		const step = params.get('step');
		if (step) {
			currentStep = steps.indexOf(step);
			if (currentStep === -1) {
				currentStep = 0;
			}
		}
	});
</script>

<div class="w-full flex flex-col gap-4">
	<!-- Step Indicators -->
	<div class="grid grid-cols-{steps.length * 2 - 1}">
		{#each steps as step, index}
			<button
				disabled={index > currentStep}
				type="button"
				class="flex flex-col items-center col-span-1"
				on:click={() => handleClick(index)}
			>
				<div class="flex items-center justify-center">
					<div
						class="w-8 h-8 flex items-center justify-center rounded-full border {index <= currentStep
							? ' bg-white text-black font-bold text-lg'
							: 'border-white bg-black text-gray-300 font-thin'}"
					>
						{index + 1}
					</div>
				</div>
				<div
					class="text-center mt-2 text-sm {index <= currentStep
						? 'text-white font-thin'
						: 'text-gray-300 font-thin'}"
				>
					{step}
				</div>
			</button>

			{#if index < steps.length - 1}
				<div
					class="col-span-1 max-md:hidden rounded-full flex-1 mt-4 h-1 {index < currentStep
						? 'bg-white'
						: 'bg-gray-600'}"
				></div>
			{/if}
		{/each}
	</div>

	<!-- Slot for Step Content -->
	<div class="">
		<div class={currentStep === 0 ? 'block' : 'hidden'}>
			<slot name="step-1"></slot>
		</div>
		<div class={currentStep === 1 ? 'block' : 'hidden'}>
			<slot name="step-2"></slot>
		</div>
		<div class={currentStep === 2 ? 'block' : 'hidden'}>
			<slot name="step-3"></slot>
		</div>
		<div class={currentStep === 3 ? 'block' : 'hidden'}>
			<slot name="step-4"></slot>
		</div>
	</div>

	<!-- Navigation Buttons -->
	<div class="pt-6 grid grid-cols-3 gap-4 md:gap-14">
		<button
			type="button"
			class="border rounded text-lg text-white px-4 py-2 {currentStep <= 0
				? 'opacity-50 cursor-not-allowed'
				: ''}"
			on:click={prev}
			disabled={currentStep <= 0}
		>
			Précédent
		</button>
		{#if $$slots['submit']}
			<slot name="submit"></slot>
		{/if}
		<button
			class="col-start-3 rounded border text-black text-lg bg-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
			on:click={next}
			type="button"
			disabled={currentStep === steps.length - 1}
		>
			Suivant
		</button>
	</div>
</div>
