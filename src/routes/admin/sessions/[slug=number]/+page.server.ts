import { buildNodesAndLinks, getSession } from '$lib/sessions/index.server';

export async function load({ params, parent }) {
	await parent();
	const sessionData = await getSession(Number(params.slug));

	const nodesAndLinks = await buildNodesAndLinks(sessionData);

	return {
		sessionData,
		nodesAndLinks
	};
}
