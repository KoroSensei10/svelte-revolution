<script>
	export let data;
</script>

<div class="h-screen text-gray-400 bg-gray-800 divide-gray-400">
	<div class="flex items-center justify-center h-full divide-x">
		<div class="grid grid-flow-row grid-cols-4 gap-4 p-3">
			{#each data.sessions as session}
				<button class="border rounded-lg">
					<a href="/sessions/{session.slug}">{session.name}</a>
				</button>
			{/each}
		</div>
	</div>
</div>
