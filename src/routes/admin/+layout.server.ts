import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';
import type { User } from '../../../types/tableTypes';

export const load: LayoutServerLoad = async ({ parent }) => {
    const data = await parent() as { user: User | null };

    if (!data.user) {
        redirect(302, '/login');
    }
};
