<script lang="ts">
	export let addnode: Function;
	export let selectedNodeId: number | undefined;

	let nodeTitle = '';
	let nodeText = '';

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
		addnode(nodeTitle, nodeText, selectedNodeId);

		nodeTitle = '';
		nodeText = '';
	}
</script>

<form class="flex flex-col justify-center items-center border border-gray-300 rounded-xl mx-5 p-5">
	<label>
		Nom du nouveau nœud :
		<input id="nodeTitle" bind:value={nodeTitle} placeholder="Entrez le titre" />
	</label>
	<label>
		Texte du nouveau noeud :
		<input id="nodeText" bind:value={nodeText} placeholder="Entrez votre texte" />
	</label>
	<button class="border border-gray-950 rounded-lg p-1" on:click={addNodeHook}
		>Ajouter un nœud au nœud sélectionné</button
	>
</form>
