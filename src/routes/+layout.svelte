<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import { isLoading, locales, locale } from 'svelte-i18n';
	import { typewriter } from '$lib/animations';
	import { Toaster } from 'svelte-french-toast';
	import { mainTitle } from '$stores/titles';
	import type { User } from '../../types/tableTypes';
	import { enhance } from '$app/forms';
	import { navigating } from '$app/stores';

	export let data: { user: User | null };

	let visible = false;

	onMount(() => {
		visible = true;
	});
</script>

<svelte:head>
	<title>
		{$mainTitle}
	</title>
</svelte:head>

<!-- UI -->
<Toaster />
<select bind:value={$locale} class="fixed bottom-0 right-0 z-50 p-4 text-white bg-gray-900 rounded-tl-xl">
	{#each $locales as l (l)}
		<option selected={String($locale).toUpperCase() === l.toUpperCase()} value={l}>
			{l.split('-')[0].toLocaleUpperCase()}
		</option>
	{/each}
</select>
<nav class="top-0 left-0 grid grid-flow-col p-4 pb-0 font-bold sm:fixed sm:flex sm:flex-col">
	<a
		href="/"
		class="col-span-1 overflow-hidden text-xl font-semibold text-center transition-all sm:text-start hover:pl-1 whitespace-nowrap dark:text-white"
	>
		{#if visible}
			{#key $mainTitle}
				<span in:typewriter|global={{ text: $mainTitle }} class=""></span><span class="blinking-underscore"
					>_</span
				>
			{/key}
		{/if}
	</a>
	<a href="/sessions" class="font-semibold transition-all max-sm:order-first hover:pl-1 dark:text-white">
		{$t('sessions')}
	</a>
	{#if data.user}
		<div class="flex justify-end w-full gap-2 sm:justify-start">
			<a href="/admin" class="pr-2 font-semibold transition-all border-r hover:pl-1 hover:pr-1 dark:text-white">
				{$t('admin')}
			</a>
			<form class="inline" action="/logout?/logout" use:enhance method="POST">
				<button type="submit" class="font-semibold transition-all hover:pl-1 dark:text-white">
					{$t('logout')}
				</button>
			</form>
		</div>
	{:else}
		<a href="/login" class="font-semibold transition-all text-end sm:text-start hover:pl-1 dark:text-white">
			{$t('login')}
		</a>
	{/if}
</nav>
<!-- When loading-->
{#if $isLoading || $navigating}
	<div class="flex items-center justify-center h-screen">
		<span class="loading loading-infinity text-primary-500 w-52" />
	</div>
{:else}
	<!-- Actual content -->
	<slot />
{/if}

<style>
	.blinking-underscore {
		animation: blink 1s step-start infinite 2s;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
