import type { MyPocketBase } from '$types/pocketBase';
import type { GraphNode, NodeType, Scenario } from '$types/pocketBase/TableTypes';

export async function createNode(
	pb: MyPocketBase,
	title: string,
	text: string,
	author: string,
	session: string,
	firstNode: GraphNode,
	type: NodeType = 'contribution'
) {
	return await pb.collection('Node').create({
		title,
		text,
		author,
		session,
		type,
		parent: firstNode.id
	});
}

export async function createSession(
	pb: MyPocketBase,
	name: FormDataEntryValue,
	scenarioId: string,
	author: FormDataEntryValue,
	image: File
) {
	if (image.size !== 0) {
		image = new File([image as Blob], `${name}.png`, { type: 'image/png' });
	}
	const sessions = await pb.collection('Session').getFullList({ fields: 'id' });
	return await pb.collection('Session').create({
		name,
		scenario: scenarioId,
		author,
		slug: sessions.length + 1,
		public: true,
		visible: true,
		completed: false,
		image
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
