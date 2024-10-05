<script lang="ts">
	interface Props {
		langs: string[];
	}
	let { langs }: Props = $props();
</script>

<div class="flex justify-center gap-4">
	{#each langs as lang}
		<button
			type="button"
			class="apparence-none has-[:checked]:bg-white has-[:checked]:text-black
                border rounded-lg"
		>
			<label class="flex flex-col" for="lang-{lang}">
				<span class="p-4 px-5 uppercase cursor-pointer">{lang}</span>
				<input
					id="lang-{lang}"
					type="radio"
					name="lang"
					class="w-0 h-0 collapse"
					checked={lang === 'fr'}
					value={lang}
				/>
			</label>
		</button>
	{/each}
</div>
