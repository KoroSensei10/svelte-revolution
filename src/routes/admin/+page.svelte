<script>
	export let data;
</script>

<div class="h-screen bg-gray-800 text-gray-400 divide-gray-400">
	<div class="flex items-center h-full justify-center divide-x">
		<div class="grid grid-cols-4 grid-flow-row gap-4 p-3">
			{#each data.sessions as session}
				<button class="border rounded-lg">
					<a href="/sessions/{session.id}">{session.name}</a>
				</button>
			{/each}
		</div>
	</div>
</div>
