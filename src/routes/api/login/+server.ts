// src/routes/api/login/+server.js
import bcrypt from 'bcrypt';
import User from '$lib/models/User';

export async function POST({ request, cookies }) {
	const { username, password } = await request.json();

	const user = await User.findOne({ where: { username } });

	if (!user) {
		return new Response(JSON.stringify({ success: false, message: 'User not found' }), {
			status: 404
		});
	}

	const passwordMatch = await bcrypt.compare(password, user.password);

	if (!passwordMatch) {
		return new Response(JSON.stringify({ success: false, message: 'Incorrect password' }), {
			status: 401
		});
	}

	// Enregistre la session dans les cookies
	cookies.set('session', user.id, { httpOnly: true, path: '/' });

	return new Response(JSON.stringify({ success: true, user }), { status: 200 });
}
