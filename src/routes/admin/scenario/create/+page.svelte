<script lang="ts">
	import { enhance } from '$app/forms';
	import toast from 'svelte-french-toast';
	import { t } from 'svelte-i18n';
	import nProgress from 'nprogress';

	import Stepper from '$components/form/Stepper.svelte';
	import Radio from '$components/form/Radio.svelte';
	import MultiField from '$components/form/MultiField.svelte';

	import type { ActionData, PageData } from './$types';

	interface Props {
		form: ActionData;
		data: PageData;
	}
	let { form, data }: Props = $props();

	let currentStep = $state(0);
	let theForm: HTMLFormElement;
	let validForm = $state(false);

	function checkValidity() {
		validForm = theForm?.checkValidity();
	}
</script>

<div class="flex flex-col items-center">
	<h1 class="p-4 text-3xl font-bold">{$t('scenario.newScenario')}</h1>
	<form
		bind:this={theForm}
		oninput={() => checkValidity()}
		method="POST"
		use:enhance={() => {
			nProgress.start();
			return async ({ update }) => {
				await update();
				nProgress.done();
				toast.success('Scénario créé avec succès', { duration: 3000, position: 'bottom-center' });
			};
		}}
		action="?/createScenario"
		class="flex flex-col w-full gap-4 p-4 text-center border-t md:w-4/6"
	>
		<Stepper
			bind:currentStep
			steps={[$t('scenario.essentials'), $t('scenario.firstNode'), $t('scenario.events'), $t('scenario.ends')]}
		>
			<!-- Step 1  -->
			<div slot="step-1" class="flex flex-col gap-4 p-2">
				<label for="title" class="text-xl font-thin">{$t('scenario.title')}</label>
				<input
					required
					id="title"
					name="title"
					class="w-full p-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
					placeholder="Votre super Scénario"
				/>
				<label for="prologue" class="text-xl font-thin">{$t('scenario.prologue')}</label>
				<textarea
					required
					id="prologue"
					name="prologue"
					class="w-full p-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
					rows="3"
					placeholder="La nuit était sombre..."
				></textarea>
				<Radio langs={[...data.lang]} />
			</div>
			<!-- Premier Noeud -->
			<div slot="step-2" class="flex flex-col gap-4 p-2">
				<div class="flex gap-4">
					<div class="flex flex-col w-full">
						<label for="firstNodeTitle" class="text-xl font-thin">{$t('scenario.firstNodeTitle')}</label>
						<input
							required
							id="firstNodeTitle"
							name="firstNodeTitle"
							class="w-full p-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
							placeholder="Génialisime titre"
						/>
					</div>

					<div>
						<label for="firstNodeAuthor" class="text-xl font-thin">{$t('scenario.firstNodeAuthor')}</label>
						<input
							required
							id="firstNodeAuthor"
							name="firstNodeAuthor"
							class="w-full p-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
							placeholder="Snoup"
						/>
					</div>
				</div>
				<label for="firstNodeText" class="text-xl font-thin">{$t('scenario.firstNodeText')}</label>
				<textarea
					required
					id="firstNodeText"
					name="firstNodeText"
					class="w-full p-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
					rows="3"
					placeholder="ayayaya"
				></textarea>
			</div>
			<!-- Evenements -->
			<div slot="step-3" class="flex flex-col gap-4 p-2">
				<MultiField
					props={{
						name: 'event',
						title: $t('scenario.events'),
						placeholderTitle: $t('scenario.eventTitle'),
						placeholderText: $t('scenario.eventText')
					}}
					let:item
				>
					<span slot="header" class="pb-2 text-xl font-thin border-b">{$t('scenario.events')}</span>
					<div class="flex flex-col items-center p-2">
						<div class="flex gap-4">
							<div class="w-full">
								<label for={item.name} class="text-lg font-thin">{item.titleName}</label>
								<input
									required
									id={item.name}
									name={item.name}
									placeholder={item.placeholderTitle}
									class="w-full p-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
								/>
							</div>
							<div>
								<label for={item.name + '-author'} class="text-lg font-thin"
									>{$t('scenario.author')}</label
								>
								<input
									required
									id={item.name + '-author'}
									name={item.name + '-author'}
									placeholder="Auteur"
									class="w-full p-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
								/>
							</div>
						</div>
						<div class="w-full pt-6">
							<label for={item.name + '-text'} class="text-lg font-thin">{item.textName}</label>
							<textarea
								rows="3"
								required
								id={item.name + '-text'}
								name={item.name + '-text'}
								placeholder={item.placeholderText}
								class="w-full p-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
							></textarea>
						</div>
					</div>
				</MultiField>
			</div>
			<!-- Fins -->
			<div slot="step-4" class="flex flex-col gap-4 p-2">
				<MultiField
					props={{
						name: 'end',
						title: $t('scenario.ends'),
						placeholderTitle: $t('scenario.endTitle'),
						placeholderText: $t('scenario.endText')
					}}
					let:item
				>
					<span slot="header" class="pb-2 text-xl font-thin border-b">{$t('scenario.ends')}</span>
					<div class="flex flex-col items-center p-2">
						<div class="w-full">
							<label for={item.name} class="text-lg font-thin">{item.titleName}</label>
							<input
								required
								id={item.name}
								name={item.name}
								placeholder={item.placeholderTitle}
								class="w-full p-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
							/>
						</div>
						<div class="w-full pt-6">
							<label for={item.name + '-text'} class="text-lg font-thin">{item.textName}</label>
							<textarea
								rows="3"
								required
								id={item.name + '-text'}
								name={item.name + '-text'}
								placeholder={item.placeholderText}
								class="w-full p-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
							></textarea>
						</div>
					</div>
				</MultiField>
			</div>

			<button
				slot="submit"
				type="submit"
				disabled={!validForm}
				class="text-black bg-white text-lg rounded disabled:cursor-not-allowed ease-linear disabled:opacity-50 transition-all {currentStep ===
					3 || validForm
					? 'disabled:opacity-50 block opacity-100'
					: 'disabled:opacity-0 opacity-0 disabled:cursor-default'}"
			>
				{$t('form.submit')}
			</button>
		</Stepper>
	</form>
	{#if form?.error}
		<p class="p-4 text-red-500">{form.error}</p>
	{/if}
</div>
