import { dev } from '$app/environment';
import { writable } from 'svelte/store';

export const mainTitleStore = writable('Babel Révolution');

mainTitleStore.subscribe((value) => {
	if (dev && !value.includes('DEV - ')) {
		return mainTitleStore.set('DEV - ' + value);
	}
	return value;
});
