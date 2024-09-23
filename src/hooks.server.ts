import { redirect } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

export async function handle({ event, resolve }) {
	event.locals.pb = new PocketBase('db.canard.cc');

	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	try {
		event.locals.pb.authStore.isValid && (await event.locals.pb.collection('users').authRefresh());
	} catch (_) {
		event.locals.pb.authStore.clear();
	}

	const response = await resolve(event);

	// send back the default 'pb_auth' cookie to the client with the latest store state
	response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie());

	const url = event.request.url.trim().split('__')[0];
	console.log(url);

	if (url.endsWith('/admin/') || url.endsWith('/admin')) {
		return redirect(302, '/admin/sessions/create');
	} else {
		return response;
	}
}
