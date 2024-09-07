import type { Handle } from '@sveltejs/kit';
import User from '$lib/models/User';
import { sync } from '$lib/sequelize';

export const handle: Handle = async ({ event, resolve }) => {
	sync();

	// check if the user is logged in
	const session = event.cookies.get('session');
	if (session) {
		const user = await User.findByPk(session);
		event.locals.user = (await User.findByPk(session))?.toJSON();
	} else {
		event.locals.user = null;
	}
	const response = await resolve(event);

	return response;
};
