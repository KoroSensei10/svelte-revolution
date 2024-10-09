import { dev } from '$app/environment';
import { createPocketBase } from '$lib/server/pocketbase';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = createPocketBase();
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	if (event.locals.pb.authStore.isValid) {
		try {
			await event.locals.pb.collection('users').authRefresh();
		} catch {
			event.locals.pb.authStore.clear();
		}
	}

	const response = await resolve(event);

	response.headers.append(
		'set-cookie',
		event.locals.pb.authStore.exportToCookie({ httpOnly: false, path: '/', secure: dev ? false : true })
	);

	return response;
};
