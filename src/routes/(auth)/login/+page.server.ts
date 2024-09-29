import { fail, redirect, type Actions, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ parent }) => {
	const data = await parent();

	if (data.user) {
		return redirect(302, '/admin');
	}
};

export const actions: Actions = {
	login: async ({ request, locals }) => {
		const data = await request.formData();
		const username = data.get('username') as string;
		const password = data.get('password') as string;

		try {
			await locals.pb.collection('users').authWithPassword(username, password);
		} catch (err) {
			return fail(400, { err });
		}
		return redirect(303, '/admin');
	}
};
