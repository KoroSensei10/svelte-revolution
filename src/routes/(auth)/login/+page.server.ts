import { type Actions, fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	login: async ({ request, locals }) => {
		const data = await request.formData();
		const username = data.get('username') as string;
		const password = data.get('password') as string;

		try {
			await locals.pb.collection('users').authWithPassword(username, password);
		} catch (err) {
			return fail(400, { err: JSON.stringify(err) });
		}
		return redirect(303, '/admin');
	}
};
