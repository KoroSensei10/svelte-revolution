import { buildNodesAndLinks, getSession } from '$lib/server/sessions';
import { fail, type Actions, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ params, parent }) => {
	const sessionData = await getSession(Number(params.slug));

	const nodesAndLinks = await buildNodesAndLinks(sessionData);

	return {
		...(await parent()),
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
	}
};
