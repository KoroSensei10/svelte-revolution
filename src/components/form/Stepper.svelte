<script lang="ts">
	import type { Snippet } from 'svelte';
	import { t } from 'svelte-i18n';

	interface Props {
		steps: string[];
		currentStep: number;
		step1: Snippet;
		step2: Snippet;
		step3: Snippet;
		step4: Snippet;
		submit?: Snippet;
	}
	let { steps, currentStep = $bindable(), step1, step2, step3, step4, submit }: Props = $props();

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

<div class="flex flex-col w-full gap-4">
	<!-- Step Indicators -->
	<div class="grid grid-flow-col">
		{#each steps as step, index (step)}
			<button
				disabled={index > currentStep}
				type="button"
				class="flex flex-col items-center col-span-1"
				onclick={() => handleClick(index)}
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

	<!-- Snippet for Step Content -->
	<div class="">
		<div class={currentStep === 0 ? 'block' : 'hidden'}>
			{@render step1()}
		</div>
		<div class={currentStep === 1 ? 'block' : 'hidden'}>
			{@render step2()}
		</div>
		<div class={currentStep === 2 ? 'block' : 'hidden'}>
			{@render step3()}
		</div>
		<div class={currentStep === 3 ? 'block' : 'hidden'}>
			{@render step4()}
		</div>
	</div>

	<!-- Navigation Buttons -->
	<div class="grid grid-cols-3 gap-4 pt-6 md:gap-14">
		<button
			type="button"
			class="border rounded text-lg text-white px-4 py-2 {currentStep <= 0
				? 'opacity-50 cursor-not-allowed'
				: ''}"
			onclick={prev}
			disabled={currentStep <= 0}
		>
			{$t('form.previous')}
		</button>
		{#if submit}
			{@render submit()}
		{/if}
		<button
			class="col-start-3 px-4 py-2 text-lg text-black bg-white border rounded disabled:opacity-50 disabled:cursor-not-allowed"
			onclick={next}
			type="button"
			disabled={currentStep === steps.length - 1}
		>
			{$t('form.next')}
		</button>
	</div>
</div>
