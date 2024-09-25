import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = async ({ url }) => {
	console.log('layout load', url.pathname);

	return {
		route: url.pathname
	};
};
