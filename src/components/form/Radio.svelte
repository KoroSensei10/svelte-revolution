<script lang="ts">
	export let langs: string[];
</script>

<div class="flex gap-4 justify-center">
	{#each langs as lang}
		<button
			type="button"
			class="apparence-none has-[:checked]:bg-white has-[:checked]:text-black
                border rounded-lg"
		>
			<label class="flex flex-col" for="lang-{lang}">
				<span class="uppercase cursor-pointer p-4 px-5">{lang}</span>
				<input
					id="lang-{lang}"
					type="radio"
					name="lang"
					class="collapse w-0 h-0"
					checked={lang === 'fr'}
					value={lang}
				/>
			</label>
		</button>
	{/each}
</div>
