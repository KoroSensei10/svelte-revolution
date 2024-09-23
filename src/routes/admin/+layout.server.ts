import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';
import type { User } from '../../../types/tableTypes';

export const load: LayoutServerLoad = async ({ parent, request }) => {
	const data = (await parent()) as { user: User | null };

	if (!data.user) {
		return redirect(302, '/login');
	}
};
