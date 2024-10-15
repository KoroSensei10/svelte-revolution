import type { Session } from '$types/pocketBase/TableTypes';
import { error } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';
import { type MyPocketBase } from '../../../types/pocketBase/index';

export async function getSession(pb: MyPocketBase, sessionId: number) {
	let session: Session;
	try {
		session = await pb
			.collection('session')
			.getFirstListItem('slug=' + sessionId.toString(), { expand: 'end, scenario, events' });
	} catch (e) {
		const err = e as ClientResponseError;
		if (err.status === 404) {
			error(404, {
				status: 404,
				message: 'Session not found'
			});
		} else {
			error(500, {
				status: err.status,
				message: err.message
			});
		}
	}

	return session;
}
