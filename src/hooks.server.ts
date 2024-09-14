import type { Handle } from '@sveltejs/kit';
import User from '$lib/models/User';
import { sync } from '$lib/sequelize';

export const handle: Handle = async ({ event, resolve }) => {
	sync();

	// TODO : check if the user is logged in
	const response = await resolve(event);

	return response;
};
