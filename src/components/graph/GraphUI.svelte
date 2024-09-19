<script lang="ts">
	export let addnode: (title: string, text: string, author: string, parentId: string) => void;
	export let selectedNodeId: string | undefined;

	let nodeTitle = '';
	let nodeText = '';
	let nodeAuthor = '';

	let theForm: HTMLFormElement;
	let validForm = false;

	function addNodeHook() {
		if (!selectedNodeId) {
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
		addnode(nodeTitle, nodeText, nodeAuthor, selectedNodeId);

		nodeTitle = '';
		nodeText = '';
	}
</script>

<div
	class="fixed bottom-0 w-full border-t w-fullbg-black scrollbar-thin scrollbar-thumb-white scrollbar-track-black sm:top-0 sm:bottom-auto sm:right-0 sm:border-t-0 sm:border-b sm:border-l sm:w-1/3 lg:w-1/4"
>
	<form
		bind:this={theForm}
		on:submit|preventDefault={addNodeHook}
		on:input={() => (validForm = theForm?.checkValidity())}
	>
		<div class="w-full rounded-none collapse collapse-arrow">
			<input type="checkbox" class="" checked />
			<div class="w-full font-bold underline bg-gray-900 underline-offset-4 collapse-title">
				Ecrire un message
			</div>
			<div class="z-50 flex flex-col py-0 bg-black collapse-content snoup">
				<div class="w-full">
					<div class="w-full">
						<input
							required
							bind:value={nodeTitle}
							name={'name'}
							placeholder="Titre"
							class="w-full py-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
						/>
					</div>
				</div>
				<div class="w-full">
					<textarea
						required
						bind:value={nodeText}
						name={'text'}
						placeholder="Votre texte"
						class="w-full py-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
					/>
				</div>
				<div class="w-full">
					<input
						required
						bind:value={nodeAuthor}
						name={'author'}
						placeholder="Votre nom"
						class="w-full py-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
					/>
				</div>
				<div class="w-full py-4 text-center">
					<button type="submit" disabled={!validForm} class="font-light text-white btn"> Publier </button>
				</div>
			</div>
		</div>
		<div class="sticky bottom-0 border-t rounded-none collapse collapse-arrow">
			<input type="checkbox" />
			<div class="font-bold underline bg-gray-900 underline-offset-4 collapse-title">Autre</div>
			<div class="collapse-content">
				<div class="pt-2">Snoup</div>
			</div>
		</div>
	</form>
</div>

<style lang="postcss">
	.snoup {
		@apply py-0;
	}
</style>
