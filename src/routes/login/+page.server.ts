import { fail, redirect, type Actions } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import User from '$lib/models/User';

export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();

		const username = data.get('username');
		const password = data.get('password')?.toString() || '';

		if (!username) {
			return fail(400, { username, missing: true });
		}

		const user = await User.findOne({ where: { username } });

		const passwordMatch = await bcrypt.compare(password, user?.password);

		if (!user || !passwordMatch) {
			return fail(401, { username, incorrect: true });
		}

		// Enregistre la session dans les cookies
		cookies.set('session', user.id, { httpOnly: true, path: '/' });

		redirect(303, '/profile');
	}
} satisfies Actions;
