import Scenario from '$lib/models/Scenario';
import { fail, type Actions } from '@sveltejs/kit';

export const actions = {
	createScenario: async ({ request }) => {
		const data = await request.formData();

		console.log(data);

		const title = data.get('title');
		const prologue = data.get('prologue');
		const lang = data.get('lang');

		if (!title || !prologue) {
			return fail(400, { error: 'Missing required fields' });
		}

		try {
			const scenario = await Scenario.create({ title, prologue, lang });
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

export function load() {
	return {
		lang: Scenario.getAttributes().lang.values ?? []
	};
}
