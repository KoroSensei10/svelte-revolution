<script>
	export let watermarkText = 'Filigrane';
</script>

<div class="relative">
	<div
		class="absolute overflow-hidden inset-0 flex justify-center items-center opacity-10 text-6xl text-white italic font-bold pointer-events-none select-none"
	>
		{#each Array.from({ length: 10 }, (_, i) => i) as i}
			<div class="" style="transform: rotate({i * 36}deg);">
				{watermarkText}
			</div>
		{/each}
	</div>
	<div class="relative z-10">
		<slot />
	</div>
</div>
