import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';
import { pb } from '$lib/pocketbase';
import type { User } from '$types/tableTypes';

export const load: LayoutServerLoad = async ({ url }) => {
	console.log('layout load', url.pathname);

	return {
		route: url.pathname
	};
};
