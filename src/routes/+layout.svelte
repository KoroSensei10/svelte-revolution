<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';

	import { typewriter } from '$lib/animations';

	import { t } from 'svelte-i18n';
	import { isLoading, locales, locale } from 'svelte-i18n';
	import { Toaster } from 'svelte-french-toast';

	let title = 'Babel Revolution';

	let visible = false;
	onMount(() => {
		visible = true;
	});
</script>

<svelte:head>
	<title>
		{title}
	</title>
</svelte:head>

<div>
	<Toaster />
	{#if $isLoading}
		<p>Loading...</p>
	{:else}
		<select bind:value={$locale} class="fixed bottom-0 right-0 z-50 p-4 text-white bg-gray-900 rounded-tl-xl">
			{#each $locales as l (l)}
				<option selected={String($locale).toUpperCase() === l.toUpperCase()} value={l}
					>{l.split('-')[0].toLocaleUpperCase()}</option
				>
			{/each}
		</select>
		<nav
			class="sticky top-0 z-50 flex items-baseline justify-between w-full p-4 text-white bg-gray-900 border-b border-white"
		>
			<a href="/" class="self-center font-semibold transition-all hover:pl-1 whitespace-nowrap dark:text-white">
				{#if visible}
					<span transition:typewriter class="">Babel Revolution</span><span class="blinking-underscore"
						>_</span
					>
				{/if}
			</a>
			<div class="flex float-right gap-4 underline-offset-2">
				<a href="/sessions" data-title="Sessions" class="hover:underline">{$t('sessions')}</a>
				<a href="/admin/sessions/create" class="hover:underline">{$t('createSession')}</a>
				<a href="/admin/scenario/create" class="hover:underline">{$t('createScenario')}</a>
			</div>
		</nav>
		<slot />
	{/if}
</div>

<style>
	.blinking-underscore {
		animation: blink 2s step-start infinite 2s;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
