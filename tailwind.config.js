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
