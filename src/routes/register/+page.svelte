<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<form method="POST" action="?/register">
	{#if form?.missing}<p class="error">The email field is required</p>{/if}
	{#if form?.error}
		<p class="error">Error !</p>
	{/if}
	<input name="username" type="text" placeholder="Username" />
	<input name="password" type="password" placeholder="Password" />
	<button type="submit">Register</button>
</form>
