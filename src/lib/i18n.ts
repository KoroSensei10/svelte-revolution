// src/i18n.js
import { getLocaleFromNavigator, init, register, waitLocale } from 'svelte-i18n';

register('fr-FR', () => import('../lang/fr.json'));
register('en-US', () => import('../lang/en.json'));
register('jp-JP', () => import('../lang/jp.json'));

init({
	fallbackLocale: 'fr-FR',
	initialLocale: getLocaleFromNavigator()
});

waitLocale();
