import { dev } from '$app/environment';
import { writable } from 'svelte/store';

export const mainTitle = writable('Babel Révolution');

mainTitle.subscribe((value) => {
    if (dev && !value.includes('DEV - ')) {
        return mainTitle.set('DEV - ' + value);
    }
    return value;
});