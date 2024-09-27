<script>
	export let watermarkText = 'Filigrane';
</script>

<div class="relative">
	<div
		class="absolute inset-0 flex items-center justify-center overflow-hidden text-6xl italic font-bold text-white pointer-events-none select-none opacity-10"
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
