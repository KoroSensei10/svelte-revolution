import { buildNodesAndLinks, getSession } from '$lib/server/sessions';
import { createNode } from '$lib/server/sessions/create';
import { type Actions, fail, type ServerLoad } from '@sveltejs/kit';
import type { End, GraphEvent } from '$types/pocketBase/TableTypes';

export const load: ServerLoad = async ({ params, parent, locals }) => {
	const sessionData = await getSession(Number(params.slug));
	const nodesAndLinks = await buildNodesAndLinks(sessionData);

	let events: GraphEvent[] = [];
	let ends: End[] = [];

	if (locals.pb.authStore.isValid) {
		const scenario = sessionData.expand.scenario.id;
		events = await locals.pb.collection('Event').getFullList({
			filter: locals.pb.filter('scenario = {:scenario}', { scenario })
		});
		ends = await locals.pb.collection('End').getFullList({
			filter: locals.pb.filter('scenario = {:scenario}', { scenario })
		});
	}

	return {
		...(await parent()),
		sessionData,
		nodesAndLinks,
		events,
		ends
	};
};

export const actions: Actions = {
	addNode: async ({ request, locals }) => {
		const data = await request.formData();

		const title = data.get('title') as string;
		const text = data.get('text') as string;
		const author = data.get('author') as string;
		const parent = data.get('parent') as string;
		const session = data.get('session') as string;

		if (!parent) {
			return fail(422, { success: false, error: 'No selected node' });
		}
		if (!session) {
			return fail(500, { success: false, error: 'Not in a session' });
		}

		if (!title || !text || !author) {
			return fail(422, { success: false, error: 'Missing required fields' });
		}

		const node = await locals.pb.collection('Node').create({
			title,
			text,
			author,
			type: 'contribution',
			parent,
			session
		});

		return {
			status: 200,
			success: true,
			body: { message: 'Node added', node: JSON.stringify(node) }
		};
	},
	// Admin only
	addEvent: async ({ request, locals }) => {
		const data = await request.formData();

		const eventId = data.get('eventId') as string;
		const sessionId = data.get('session') as string;

		if (!sessionId) {
			return fail(500, { success: false, error: 'Not in a session' });
		}
		if (!eventId) {
			return fail(422, { success: false, error: 'Missing required fields' });
		}

		let createdEventNode: GraphEvent;
		try {
			const { title, text, author } = await locals.pb.collection('Event').getOne(eventId);
			const firstNode = await locals.pb.collection('Node').getFirstListItem(
				locals.pb.filter('type = {:type} && session = {:session}', {
					session: sessionId,
					type: 'startNode'
				})
			);
			createdEventNode = await createNode(locals.pb, title, text, author, sessionId, firstNode, 'event');
			await locals.pb.collection('Session').update(sessionId, { events: createdEventNode.id });
		} catch (error) {
			console.error('Error creating event:', JSON.stringify(error));
			return fail(500, { success: false, error: 'Error while creating event' });
		}

		return {
			status: 200,
			success: true,
			body: { message: 'Event added', event: JSON.stringify(createdEventNode) }
		};
	},
	endSession: async ({ request, locals }) => {
		const data = await request.formData();
		const sessionId = data.get('session') as string;
		const endId = data.get('endId') as string;

		if (!sessionId) {
			return fail(500, { success: false, error: 'Not in a session' });
		}
		if (!endId) {
			return fail(422, { success: false, error: 'Missing required fields' });
		}

		try {
			await locals.pb.collection('Session').update(sessionId, {
				completed: true,
				end: endId
			});
		} catch (error) {
			console.error('Error ending session:', JSON.stringify(error));
			return fail(500, { success: false, error: 'Error while ending session' });
		}

		return {
			status: 200,
			success: true,
			body: { message: 'Session ended' }
		};
	}
};
