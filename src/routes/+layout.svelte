<svelte:options runes={true} />

<script lang="ts">
	import '../app.css';
	import { onMount, type Snippet } from 'svelte';
	import { enhance } from '$app/forms';
	import { navigating } from '$app/stores';
	import { locale, locales, t } from 'svelte-i18n';
	import 'nprogress/nprogress.css';
	import NProgress from 'nprogress';
	import { typewriter } from '$lib/animations';
	import { Toaster } from 'svelte-french-toast';
	import type { User } from '$types/pocketBase/TableTypes';
	import { titles } from '$stores/titles/index.svelte';

	type Props = {
		data: { user: User; isAdmin: boolean };
		children: Snippet;
	};
	let { data, children }: Props = $props();

	let visible = $state(false);

	NProgress.configure({
		// Full list: https://github.com/rstacruz/nprogress#configuration
		minimum: 0.16
	});

	$effect.pre(() => {
		if ($navigating) {
			NProgress.start();
		} else {
			NProgress.done();
		}
	});

	onMount(() => {
		visible = true;
	});
</script>

<!-- UI -->
<Toaster />
<select
	bind:value={$locale}
	class="fixed bottom-0 right-0 z-50 p-4 text-white bg-gray-900 rounded-tl-xl"
	id="langSelect"
>
	{#each $locales as l (l)}
		<option selected={String($locale).toUpperCase() === l.toUpperCase()} value={l}>
			{l.split('-')[0].toLocaleUpperCase()}
		</option>
	{/each}
</select>
<nav
	class="top-0 left-0 z-50 grid w-full grid-flow-col p-4 pr-2 overflow-hidden font-bold bg-black bg-opacity-80 sm:w-1/3 md:w-1/4 sm:border-b sm:border-r sm:fixed sm:flex sm:flex-col"
>
	<a
		class="col-span-1 overflow-hidden text-xl font-semibold text-center transition-all sm:text-start hover:pl-1 whitespace-nowrap dark:text-white"
		href="/"
	>
		{#if visible}
			{#key titles.mainTitle}
				<span in:typewriter|global={{ text: titles.mainTitle }} class=""></span><span
					class="blinking-underscore">_</span
				>
			{/key}
		{/if}
	</a>
	<a class="font-semibold transition-all max-sm:order-first hover:pl-1 dark:text-white" href="/sessions">
		{$t('sessions.sessions')}
	</a>
	<a class="font-semibold transition-all hover:pl-1 dark:text-white" href="/home">
		{$t('home')}
	</a>
	{#if data.user}
		<div class="flex justify-end w-full gap-2 sm:justify-start">
			{#if data.isAdmin}
				<a
					href="/admin"
					class="pr-2 font-semibold transition-all border-r hover:pl-1 hover:pr-1 dark:text-white"
				>
					{$t('admin')}
				</a>
			{/if}
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

{@render children()}

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
