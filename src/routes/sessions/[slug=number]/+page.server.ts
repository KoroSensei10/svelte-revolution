import { buildNodesAndLinks, getSession } from '$lib/sessions/index.server';

export async function load({ params }) {
	const sessionData = await getSession(Number(params.slug));

	const nodesAndLinks = await buildNodesAndLinks(sessionData);

	return {
		sessionData,
		nodesAndLinks
	};
}
