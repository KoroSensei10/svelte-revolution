import type { MyPocketBase } from '$types/pocketBase';

export async function getScenario(pb: MyPocketBase, scenarioId: string) {
	return await pb.collection('Scenario').getOne(scenarioId);
}
