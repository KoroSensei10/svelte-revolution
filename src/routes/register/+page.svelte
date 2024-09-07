<script>
    let username = '';
    let password = '';
  
    const register = async () => {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
  
      const data = await res.json();
      if (data.success) {
        alert('Registration successful!');
      } else {
        alert(data.message);
      }
    };
</script>

<form on:submit|preventDefault={register}>
    <input type="text" bind:value={username} placeholder="Username" />
    <input type="password" bind:value={password} placeholder="Password" />
    <button type="submit">Register</button>
</form>