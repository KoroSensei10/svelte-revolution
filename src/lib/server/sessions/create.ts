import type { MyPocketBase } from '$types/pocketBase';
import type { Scenario } from '$types/tableTypes';

export async function getScenario(pb: MyPocketBase, scenarioId: string) {
	return await pb.collection('Scenario').getOne(scenarioId);
}

export async function createSession(
	pb: MyPocketBase,
	name: FormDataEntryValue,
	scenarioId: string,
	author: FormDataEntryValue
) {
	const sessions = await pb.collection('Session').getFullList({ fields: 'id' });
	return await pb.collection('Session').create({
		name,
		scenario: scenarioId,
		author,
		slug: sessions.length + 1
	});
}

export async function createStartNode(pb: MyPocketBase, scenario: Scenario, sessionId: string) {
	return await pb.collection('Node').create({
		title: scenario.firstNodeTitle,
		text: scenario.firstNodeText,
		author: scenario.firstNodeAuthor,
		session: sessionId,
		type: 'startNode'
	});
}
