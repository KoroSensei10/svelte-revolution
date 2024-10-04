<svelte:options runes={true} />

<script lang="ts">
	let { children } = $props();
</script>

{@render children()}
