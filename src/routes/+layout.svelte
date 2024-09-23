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

<div>
	<Toaster />
	{#if $isLoading}
		<p>Loading...</p>
		<select bind:value={$locale} class="fixed bottom-0 right-0 z-50 p-4 text-white bg-gray-900 rounded-tl-xl">
			{#each $locales as l (l)}
				<option selected={String($locale).toUpperCase() === l.toUpperCase()} value={l}>
					{l.split('-')[0].toLocaleUpperCase()}
				</option>
			{/each}
		</select>
	{:else}
		<div class="fixed top-0 left-0 flex flex-col p-4">
			<a href="/" class="font-semibold transition-all hover:pl-1 whitespace-nowrap dark:text-white">
				{#if visible}
					{#key $mainTitle}
						<span transition:typewriter|global={{ text: $mainTitle }} class=""></span>
					{/key}
					<span class="blinking-underscore">_</span>
				{/if}
			</a>
			<a href="/sessions" class="font-semibold transition-all hover:pl-1 dark:text-white">
				{$t('sessions')}
			</a>
			{#if data.user}
				<a href="/admin" class="font-semibold transition-all hover:pl-1 dark:text-white">
					{$t('admin')}
				</a>
				<form class="inline" action="/logout?/logout" use:enhance method="POST">
					<button type="submit" class="font-semibold transition-all hover:pl-1 dark:text-white">
						{$t('logout')}
					</button>
				</form>
			{:else}
				<a href="/login" class="font-semibold transition-all hover:pl-1 dark:text-white">
					{$t('login')}
				</a>
			{/if}
		</div>
		<slot />
	{/if}
</div>

<style>
	.blinking-underscore {
		animation: blink 2s step-start infinite 1s;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
