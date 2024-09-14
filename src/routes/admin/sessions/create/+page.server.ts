import Node from '$lib/models/Node';
import Scenario from '$lib/models/Scenario';
import Session from '$lib/models/Session';
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
			const scenario = await Scenario.findByPk(scenarioId.toString());
			if (!scenario) {
				return fail(404, { error: 'Scenario not found' });
			}
			const session = await Session.create({ name, scenarioId, author });

			const scenarioData = await scenario.toJSON();

			const firstNode = {
				id: 1,
				sessionId: session.get('id'),
				title: scenarioData.firstNodeTitle,
				text: scenarioData.firstNodeText,
				author: scenarioData.firstNodeAuthor,
				type: 'startNode',
			};

			await Node.create(firstNode);


			return {
				status: 201,
				success: true,
				session: await session.toJSON()
			};
		} catch (error) {
			console.log(error);

			return fail(500, { error: String(error) });
		}
	}
} satisfies Actions;

export const load = async () => {
	const scenarios = await Scenario.findAll();
	return {
		scenarios: scenarios.map((scenario) => scenario.toJSON())
	};
};
