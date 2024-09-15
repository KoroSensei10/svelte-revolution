import { pb } from '$lib/pocketbase';
import { fail, type Actions } from '@sveltejs/kit';

export const actions = {
	// TODO - Add validation + split code
	createSession: async ({ request }) => {
		const data = await request.formData();

		const name = data.get('name');
		const scenarioId = data.get('scenarioId');
		const author = data.get('author');

		if (!name || !scenarioId || !author) {
			return fail(400, { error: 'Missing required fields' });
		}

		try {
			// check if scenario exists
			const scenario = await pb.collection('scenario').getOne(scenarioId.toString());
			if (!scenario) {
				return fail(404, { error: 'Scenario not found' });
			}

			// get number of sessions
			const sessions = await pb.collection('session').getFullList({ fields: 'id' });
			const session = await pb.collection('session').create({
				name,
				scenario: scenario.id,
				author,
				slug: sessions.length + 1
			});

			await pb.collection('node').create({
				title: scenario.firstNodeTitle,
				text: scenario.firstNodeText,
				author: scenario.firstNodeAuthor,
				session: session.id,
				type: 'startNode'
			});

			return {
				status: 201,
				success: true,
				session: session
			};
		} catch (error) {
			console.log(error.response);

			return fail(500, { error: String(error) });
		}
	}
} satisfies Actions;

export const load = async () => {
	const scenarios = await pb.collection('scenario').getFullList();
	return {
		scenarios
	};
};
