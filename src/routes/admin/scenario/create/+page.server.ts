import { fail, type Actions } from '@sveltejs/kit';
import { createEventsAndEnds, createScenario } from '$lib/server/scenario/create';

export const actions = {
	createScenario: async ({ request, locals }) => {
		const data = await request.formData();

		const title = data.get('title');
		const prologue = data.get('prologue');
		const lang = data.get('lang');
		const firstNodeTitle = data.get('firstNodeTitle');
		const firstNodeText = data.get('firstNodeText');
		const firstNodeAuthor = data.get('firstNodeAuthor');
		const events = data.getAll('event');
		const eventTexts = data.getAll('event-text');
		const eventAuthors = data.getAll('event-author');
		const ends = data.getAll('end');
		const endTexts = data.getAll('end-text');

		if (
			!title ||
			!prologue ||
			!lang ||
			!firstNodeTitle ||
			!firstNodeText ||
			!firstNodeAuthor ||
			!events.length ||
			!ends.length
		) {
			return fail(400, { error: 'Missing required fields' });
		}

		try {
			const pb = locals.pb;
			const scenario = await createScenario(pb, {
				title,
				prologue,
				lang,
				firstNodeTitle,
				firstNodeText,
				firstNodeAuthor
			});

			try {
				await createEventsAndEnds(pb, scenario.id, events, eventTexts, eventAuthors, ends, endTexts);
			} catch (error) {
				pb.collection('scenario').delete(scenario.id);
				return fail(500, { error: String(error) });
			}

			return {
				success: true,
				status: 201,
				body: scenario
			};
		} catch (error) {
			return fail(500, { error: String(error) });
		}
	}
} satisfies Actions;

export function load() {
	return {
		lang: ['en', 'fr', 'jp']
	};
}
