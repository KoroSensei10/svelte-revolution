<script lang="ts">
	import { currentUser, pb } from '$lib/pocketbase';

	let username = '';
	let password = '';

	async function login() {
		await pb.collection('users').authWithPassword(username, password);
	}

	async function signUp() {
		try {
			const data = {
				username,
				password,
				passwordConfirm: password
			};
			await pb.collection('users').create(data);
			await login();
		} catch (error) {
			console.error(error);
		}
	}

	function logout() {
		pb.authStore.clear();
	}
</script>

{#if $currentUser}
	<p>Vous êtes connecté en tant que {$currentUser.username}</p>
	<button on:click={logout}>Logout</button>
{:else}
	<form on:submit|preventDefault>
		<label>
			<span>Username</span>
			<input type="text" bind:value={username} />
		</label>
		<label>
			<span>Password</span>
			<input type="password" bind:value={password} />
		</label>
		<button on:click={login}>Login</button>
		<button on:click={signUp}>Login</button>
	</form>
{/if}
