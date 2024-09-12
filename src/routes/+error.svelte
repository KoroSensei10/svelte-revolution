<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="h-screen bg-gray-800 text-gray-400 divide-gray-400">
	<div class="flex items-center h-full justify-center divide-x">
		<div class="text-6xl font-light p-4">{$page.error?.status}</div>
		<div class="text-2xl font-thin p-4">
			{$page.error?.message}
		</div>
	</div>
	<a
		class="border-b border-gray-300 hover:bg-gray-700 p-2 hover:rounded-lg mt-5 transition-all hover:shadow-lg"
		href="/"
	>
		Retour à l'accueil
	</a>
</div>
