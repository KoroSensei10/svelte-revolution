// src/routes/api/register/+server.js
import bcrypt from 'bcrypt';
import User from '$lib/models/User';

export async function POST({ request }) {
  const { username, password } = await request.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ username, password: hashedPassword });
    return new Response(JSON.stringify({ success: true, user }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'Username already exists' }), { status: 400 });
  }
}
