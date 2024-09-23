import { pb } from '$lib/pocketbase';
import { redirect, type Actions } from '@sveltejs/kit'

export const load = async ({ parent }) => {
    const data = await parent();

    if (data.user) {
        return redirect(302, '/admin');
    }
};

export const actions: Actions = {
    login: async ({ cookies, request }) => {
        const data = await request.formData();
        const username = data.get('username');
        const password = data.get('password');

        if (!username || !password) {
            return {
                status: 400,
                success: false,
                message: 'Missing username or password'
            };
        }

        try {
            await pb.collection('Users').authWithPassword(username.toString(), password.toString());
            cookies.set('pb-auth', pb.authStore.exportToCookie(), { path: '/' });
        } catch (e) {
            return {
                status: 401,
                success: false,
                message: (e as Error).message
            };
        }

        return redirect(302, '/admin');
    },
};
