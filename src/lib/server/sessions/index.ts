import { pb } from '$lib/pocketbase';
import type { LinkMessage } from '$types/graph';
import type { Session } from '$types/pocketBase/TableTypes';
import { error } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';

export async function getSession(sessionId: number) {
	let session: Session;
	try {
		session = await pb
			.collection('session')
			.getFirstListItem('slug=' + sessionId.toString(), { expand: 'end, scenario' });
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

export async function buildNodesAndLinks(session: Session) {
	const nodes = await pb.collection('Node').getFullList({ filter: `session="${session.id}"`, expand: 'Side' });
	const links: LinkMessage[] = [];

	nodes.forEach((node) => {
		const parent = !node.parent ? null : String(node.parent);
		if (parent) {
			links.push({
				source: parent,
				target: node.id
			});
		}
	});

	return {
		nodes,
		links
	};
}
