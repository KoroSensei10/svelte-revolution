<script lang="ts">
	import type { Socket } from 'socket.io-client';

	export let socket: Socket; // TODO : type this
	export let selectedNodeId: number | null = null;

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
		socket.emit('newNodeClient', {
			selectedNodeId,
			nodeTitle,
			nodeText
		});
	}
</script>

<form>
	<label>
		Nom du nouveau nœud :
		<input id="nodeTitle" bind:value={nodeTitle} placeholder="Entrez le titre" />
	</label>
	<label>
		Texte du nouveau noeud :
		<input id="nodeText" bind:value={nodeText} placeholder="Entrez votre texte" />
	</label>
	<button on:click={addNodeHook}>Ajouter un nœud au nœud sélectionné</button>
</form>
