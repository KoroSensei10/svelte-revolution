<script lang="ts">
	let username = '';
	let password = '';

	async function login() {
		const res = await fetch('/api/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		});

		const data = await res.json();
		if (data.success) {
			alert('Login successful!');
		} else {
			alert(data.message);
		}
	}
</script>

<form on:submit|preventDefault={login}>
	<input type="text" bind:value={username} placeholder="Username" />
	<input type="password" bind:value={password} placeholder="Password" />
	<button type="submit">Login</button>
</form>
