<script>
	import '../app.css';
	import { Toaster } from 'svelte-french-toast';
	import { isLoading, locales, locale } from 'svelte-i18n';
</script>

<Toaster />

{#if $isLoading}
	<p>Loading...</p>
{:else}
	<div>
		<select bind:value={$locale} class="fixed top-0 left-0 bg-black p-4 text-white">
			{#each $locales as l, i}
				<option value={l}>{l.toUpperCase()}</option>
			{/each}
		</select>
	</div>
	<slot />
{/if}
