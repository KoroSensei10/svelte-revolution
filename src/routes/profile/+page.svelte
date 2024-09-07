<script>
	export let data;
	const user = data?.user;
</script>

<div>
	{#if user}
		<h1>Welcome, {user.username}!</h1>
		<!-- Afficher d'autres informations de profil ici -->
	{:else}
		<p>Redirecting to login...</p>
	{/if}
</div>
