<script lang="ts">
	export let steps: string[] = []; // Liste des étapes
	export let currentStep: number; // Étape actuelle

	function next() {
		if (currentStep < steps.length - 1) {
			currentStep += 1;
		}
	}

	function prev() {
		if (currentStep > 0) {
			currentStep -= 1;
		}
	}

	function handleClick(index: number) {
		if (index < currentStep) {
			currentStep = index;
		}
	}
</script>

<div class="w-full flex flex-col gap-4">
	<!-- Step Indicators -->
	<div class="flex justify-between">
		{#each steps as step, index}
			<button
				disabled={index > currentStep}
				type="button"
				class="flex flex-col items-center"
				on:click={() => handleClick(index)}
			>
				<div class="flex items-center justify-center">
					<div
						class="w-8 h-8 flex items-center justify-center rounded-full border transition-all {index <=
						currentStep
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
					class="flex-1 h-1 my-auto mx-2 transition-all {index < currentStep ? 'bg-white' : 'bg-gray-600'}"
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
	<div class="border-t pt-6 flex justify-between">
		<button
			type="button"
			class="border rounded text-white px-4 py-2 {currentStep <= 0 ? 'opacity-50 cursor-not-allowed' : ''}"
			on:click={prev}
			disabled={currentStep <= 0}
		>
			Précédent
		</button>
		<button
			class="rounded border text-black text-lg bg-white px-4 py-2 {currentStep === steps.length - 1
				? 'opacity-50 cursor-not-allowed'
				: ''}"
			on:click={next}
			type="button"
			disabled={currentStep === steps.length - 1}
		>
			Suivant
		</button>
	</div>
</div>
