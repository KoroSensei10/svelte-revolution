<script>
	import '../app.css';
	import { Toaster } from 'svelte-french-toast';
	import { isLoading, locales, locale, t } from 'svelte-i18n';
</script>

<Toaster />

{#if $isLoading}
	<p>Loading...</p>
{:else}
	<div class="flex flex-col items-center fixed top-0 left-0 rounded-br-xl bg-black p-4 text-white">
		{$t('language')}
		<select bind:value={$locale} class="">
			{#each $locales as l (l)}
				<option selected={l === $locale} value={l}>{l.toUpperCase()}</option>
			{/each}
		</select>
	</div>
	<slot />
{/if}
