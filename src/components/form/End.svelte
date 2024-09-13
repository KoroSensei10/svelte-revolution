<script lang="ts">
	export let label: string;
	export let value: string;
	export let title: string;
	export let text: string;
	export let index: number;
</script>

<div class="flex flex-col items-center p-2">
	<div class="w-full">
		<label for={label} class="block text-sm font-medium mb-2">{label}</label>
		<input
			required
			name={label}
			bind:value={title}
			placeholder="Votre super titre de fin #{index}"
			class="py-3 px-4 block w-full border rounded-lg text-sm
				focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
		/>
	</div>
	<div class="w-full">
		<label for={value} class="block text-sm font-medium mb-2">{value}</label>
		<textarea
			rows="3"
			required
			name={value}
			bind:value={text}
			placeholder="Votre super texte de fin #{index}"
			class="py-3 px-4 block w-full border rounded-lg text-sm
				focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
		></textarea>
	</div>
</div>

<style lang="postcss">
	label {
		@apply text-sm font-bold mb-2 first-letter:capitalize m-2 first:p-0;
	}
</style>
