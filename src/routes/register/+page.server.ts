import { fail, redirect, type Actions } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import User from '$lib/models/User';

export const actions = {
	register: async ({ request }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		if (!username || !password) {
			return fail(400, { username, missing: true });
		}

		const hashedPassword = await bcrypt.hash(password.toString(), 10);

		try {
			await User.create({ username, password: hashedPassword });
		} catch (error) {
			return fail(400, { username, error: true, message: error.message });
		}

		return redirect(303, '/login');
	}
} satisfies Actions;
