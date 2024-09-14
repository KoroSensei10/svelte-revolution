<script lang="ts">
	export let data;
</script>

<div>
	<h1 class="text-4xl font-thin text-center">Sessions</h1>
	<div class="grid grid-cols-4 grid-flow-row gap-4 p-3">
		{#each data.sessions as session}
			<button class="border rounded-lg">
				<a href="/sessions/{session.id}">{session.name}</a>
			</button>
		{/each}
	</div>
</div>
