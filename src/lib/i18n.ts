// src/i18n.js
import { getLocaleFromNavigator, init, register, waitLocale } from 'svelte-i18n';

register('fr', () => import('../lang/fr.json'));
register('en', () => import('../lang/en.json'));

init({
	fallbackLocale: 'fr',
	initialLocale: getLocaleFromNavigator()
});

waitLocale();
