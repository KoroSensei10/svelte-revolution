// src/routes/profile/+page.server.js
export const load = async ({ locals }) => {
    if (!locals.user) {
      return { status: 302, redirect: '/login' };
    }
  
    return { user: locals.user };
};