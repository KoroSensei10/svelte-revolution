import '$lib/i18n';
import { locale, waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';
import { get } from 'svelte/store';

export const load: LayoutLoad = async () => {
	await waitLocale();
};
