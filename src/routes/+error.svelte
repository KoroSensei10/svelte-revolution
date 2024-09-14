<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="h-screen bg-gray-800 text-gray-400 divide-gray-400">
	<div class="flex items-center h-full justify-center divide-x">
		<div class="text-6xl font-light p-4">{$page.error?.status || $page.status || '404'}</div>
		<div class="text-2xl font-thin p-4">
			{$page.error?.message}
		</div>
	</div>
</div>
