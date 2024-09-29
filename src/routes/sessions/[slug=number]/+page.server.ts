import { buildNodesAndLinks, getSession } from '$lib/server/sessions';
import type { Actions, ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ params }) => {
	const sessionData = await getSession(Number(params.slug));

	const nodesAndLinks = await buildNodesAndLinks(sessionData);

	return {
		sessionData,
		nodesAndLinks
	};
};

export const actions: Actions = {
	addNode: async ({ request, locals }) => {
		const data = await request.formData();
		const title = data.get('title') as string;
		const text = data.get('text') as string;
		const author = data.get('author') as string;
		const parentNodeId = data.get('parentNodeId') as string;
		const sessionId = data.get('sessionId') as string;

		await locals.pb.collection('Node').create({
			title,
			text,
			author,
			type: 'contribution',
			parent: parentNodeId,
			session: sessionId
		});

		return {
			status: 200,
			body: { message: 'Node added' }
		};
	}
};
