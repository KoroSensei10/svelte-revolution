import Scenario from '$lib/models/Scenario';
import { fail, type Actions } from '@sveltejs/kit';

export const actions = {
	createScenario: async ({ request }) => {
		const data = await request.formData();

		const title = data.get('title');
		const prologue = data.get('prologue');

		if (!title || !prologue) {
			return fail(400, { error: 'Missing required fields' });
		}

		try {
			const scenario = await Scenario.create({ title, prologue });
			return {
				success: true,
				status: 201,
				body: await scenario.toJSON()
			};
		} catch (error) {
			return fail(500, { error: error.message });
		}
	}
} satisfies Actions;
