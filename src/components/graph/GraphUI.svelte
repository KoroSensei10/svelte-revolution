<script lang="ts">
	import { t } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import type { NodeMessage } from '$types/graph';

	export let addnode: (title: string, text: string, author: string, parentId: string) => void;
	export let selectedNode: NodeMessage | null;

	let nodeTitle = '';
	let nodeText = '';
	let nodeAuthor = '';

	let theForm: HTMLFormElement;
	let validForm = false;

	let addNodeChecked = false;

	function addNodeHook() {
		if (!selectedNode?.id) {
			alert("Veuillez sélectionner un nœud d'abord");
			return;
		}
		if (nodeTitle.trim() === '') {
			alert('Veuillez entrer un nom pour le nouveau nœud');
			return;
		}
		if (nodeText.trim() === '') {
			alert('Veuillez entrer un texte pour le nouveau nœud');
			return;
		}
		if (nodeAuthor.trim() === '') {
			alert('Veuillez entrer un auteur pour le nouveau nœud');
			return;
		}
		addnode(nodeTitle, nodeText, nodeAuthor, selectedNode.id);

		nodeTitle = '';
		nodeText = '';
		localStorage.setItem('author', nodeAuthor);
	}

	onMount(() => {
		nodeAuthor = localStorage.getItem('author') || '';
	});
</script>

<div
	class="fixed bottom-0 z-50 w-full bg-black border-t bg-opacity-90 scrollbar-thin scrollbar-thumb-white
	scrollbar-track-black sm:top-0 sm:bottom-auto sm:right-0 sm:border-t-0 sm:border-b sm:border-l sm:w-1/3 lg:w-1/4"
>
	<form
		class="w-full rounded-none collapse collapse-plus sm:collapse-arrow"
		bind:this={theForm}
		on:submit|preventDefault={() => {
			addNodeChecked = false;
			addNodeHook();
		}}
		on:input={() => (validForm = theForm?.checkValidity())}
	>
		<input type="checkbox" class="" name="GraphUI" bind:checked={addNodeChecked} />
		<div class="w-full font-semibold collapse-title">
			{$t('writeMessage')}
		</div>
		<div class="z-50 flex flex-col py-0 collapse-content snoup">
			<div class="w-full">
				<div class="w-full">
					<input
						required
						autocomplete="off"
						bind:value={nodeTitle}
						name={'name'}
						placeholder={$t('yourTitle')}
						class="w-full py-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
					/>
				</div>
			</div>
			<div class="w-full">
				<textarea
					required
					autocomplete="off"
					bind:value={nodeText}
					name={'text'}
					placeholder={$t('yourMessage')}
					class="w-full py-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
				/>
			</div>
			<div class="w-full">
				<input
					required
					autocomplete="username"
					bind:value={nodeAuthor}
					name={'author'}
					placeholder={$t('yourName')}
					class="w-full py-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
				/>
			</div>
			<div class="w-full py-4 text-center">
				<button
					type="submit"
					disabled={!validForm}
					class="font-light border-none btn disabled:cursor-not-allowed
						disabled:bg-white disabled:opacity-50 hover:bg-white bg-primary-500"
				>
					{$t('publish')}
				</button>
			</div>
		</div>
	</form>
	<div class="sticky bottom-0 border-t rounded-none collapse collapse-plus sm:collapse-arrow">
		<input type="checkbox" class="" name="GraphUI" />
		<div class="font-bold collapse-title">
			{$t('nodeInformation')}
		</div>
		<div class="text-white collapse-content">
			{#if selectedNode}
				<div class="p-4 text-xl font-semibold first-letter:capitalize">{selectedNode?.title}</div>
				<div>{$t('from')} {selectedNode?.author}</div>
				<div class="pt-2">{selectedNode?.text}</div>
			{:else}
				<div class="p-4 pb-0 text-xl text-center first-letter:capitalize">{$t('noNodeSelected')}</div>
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	.snoup {
		@apply py-0;
	}
</style>
