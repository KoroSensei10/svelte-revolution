<script>
	import '../app.css';
	import { t } from 'svelte-i18n';
	import { isLoading, locales, locale } from 'svelte-i18n';

	import { Toaster } from 'svelte-french-toast';
</script>

<div class="h-lvh">
	<Toaster />
	{#if $isLoading}
		<p>Loading...</p>
	{:else}
		<select bind:value={$locale} class="fixed z-50 bottom-0 right-0 rounded-tl-xl bg-gray-900 p-4 text-white">
			{#each $locales as l (l)}
				<option selected={String($locale).toUpperCase() === l.toUpperCase()} value={l}>{l}</option>
			{/each}
		</select>
		<nav
			class="w-full flex justify-between z-50 items-baseline p-4 sticky top-0 border-b border-white text-white bg-gray-900"
		>
			<a href="/">
				<span
					class="hover:pl-1 transition-all self-center whitespace-nowrap text-xl font-semibold dark:text-white"
					>Babel Revolution</span
				>
			</a>
			<div class="float-right flex gap-4 underline-offset-2">
				<a href="/sessions" class="hover:underline">{$t('sessions')}</a>
				<a href="/admin/sessions/create" class="hover:underline">{$t('createSession')}</a>
				<a href="/admin/scenario/create" class="hover:underline">{$t('createScenario')}</a>
			</div>
		</nav>
		<slot />
	{/if}
</div>
