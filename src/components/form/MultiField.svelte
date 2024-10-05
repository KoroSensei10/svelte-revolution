<script lang="ts">
	import { t } from 'svelte-i18n';
	import type { Snippet } from 'svelte';

	interface Props {
		props: { name: string; title: string; placeholderTitle: string; placeholderText: string };
		header: Snippet;
		main: Snippet<
			[
				{
					name: string;
					title: string;
					titleName: string;
					textName: string;
					placeholderTitle: string;
					placeholderText: string;
				}
			]
		>;
	}
	let { props, header, main: children }: Props = $props();

	let values = $state([1]);
</script>

{@render header()}

<div class="flex flex-col">
	<div class="pb-4">
		{#each values as value, i (value)}
			<div class="flex flex-col">
				{@render children({
					name: props.name,
					title: props.title,
					titleName: `${props.title} ${i + 1} - ${$t('scenario.title')}`,
					textName: `${props.title} ${i + 1} - ${$t('scenario.text')}`,
					placeholderTitle: props.placeholderTitle,
					placeholderText: props.placeholderText
				})}
				<button
					type="button"
					disabled={values.length <= 1}
					class="border rounded py-2 px-4 self-start text-white {values.length <= 1
						? 'opacity-50 cursor-not-allowed'
						: ''}"
					onclick={() => (values = values.filter((_, index) => index !== i))}
				>
					{$t('scenario.delete')} | {props.title} <span class="font-bold">#{i + 1}</span>
				</button>
			</div>
		{/each}
	</div>
	<button
		disabled={values.length === 5}
		type="button"
		class="border self-end py-2 px-4 rounded bg-white text-black {values.length === 5
			? 'opacity-50 cursor-not-allowed'
			: ''}"
		onclick={() => (values = [...values, values.length + 1])}
	>
		{$t('scenario.add')}
	</button>
</div>
