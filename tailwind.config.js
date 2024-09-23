import scrollbar from 'tailwind-scrollbar';
import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'selector',
	theme: {
		extend: {
			fontFamily: {
				redditSans: ['RedditSans', 'cursive']
			},
			colors: {
				primary: {
					100: '#e7fcee',
					200: '#cff9de',
					300: '#b6f5cd',
					400: '#9ef2bd',
					500: '#86efac', // base
					600: '#6bbf8a',
					700: '#508f67',
					800: '#366045',
					900: '#1b3022'
				}
			}
		}
	},
	variants: {
		backgroundColor: ['responsive', 'hover', 'focus', 'active', 'checked']
	},
	plugins: [scrollbar(), daisyui],
	daisyui: {
		themes: false,
		logs: false
	}
};
