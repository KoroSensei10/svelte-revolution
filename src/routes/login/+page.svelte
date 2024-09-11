<script lang="ts">
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;
</script>

{#if form?.success}
	<!-- ce message est ephémère ; il existe parce que la page a été rendue en
		réponse à la soumission du formulaire. il disparaîtra si l'utilisateur recharge la page -->
	<p>Vous êtes bien connecté•e ! Ravi de vous revoir, {data.user?.username}</p>
{/if}

<form method="POST" action="?/login">
	{#if form?.missing}<p class="error">The username field is required</p>{/if}
	{#if form?.incorrect}<p class="error">Invalid credentials!</p>{/if}
	<label>
		Username
		<input name="username" type="text" placeholder="Username" />
	</label>
	<label>
		Password
		<input name="password" type="password" placeholder="Password" />
	</label>
	<button type="submit">Login</button>
</form>
