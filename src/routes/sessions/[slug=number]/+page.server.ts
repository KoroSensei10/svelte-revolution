import { buildNodesAndLinks, getSession } from '$lib/server/sessions';

export async function load({ params }) {
	const sessionData = await getSession(Number(params.slug));

	const nodesAndLinks = await buildNodesAndLinks(sessionData);

	return {
		sessionData,
		nodesAndLinks
	};
}
