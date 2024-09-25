import { pb } from "$lib/pocketbase";

export async function getScenario(scenarioId: string) {
    return await pb.collection('scenario').getOne(scenarioId);
}

export async function createSession(name: FormDataEntryValue, scenarioId: string, author: FormDataEntryValue) {
    const sessions = await pb.collection('session').getFullList({ fields: 'id' });
    return await pb.collection('session').create({
        name,
        scenario: scenarioId,
        author,
        slug: sessions.length + 1
    });
}

export async function createStartNode(scenario: any, sessionId: string) {
    return await pb.collection('node').create({
        title: scenario.firstNodeTitle,
        text: scenario.firstNodeText,
        author: scenario.firstNodeAuthor,
        session: sessionId,
        type: 'startNode'
    });
}