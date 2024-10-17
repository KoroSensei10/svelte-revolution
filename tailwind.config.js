import scrollbar from 'tailwind-scrollbar';
import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: "media",
	theme: {
		extend: {
			backgroundImage: {
				'dotted-white': 'radial-gradient(white 1px, transparent 1px)', // Motif de points
				'dotted-gray': 'radial-gradient(#4a5568 1px, transparent 1px)',
				'dotted-darkGray': 'radial-gradient(#333 1px, transparent 1px)',
				'dotted-black': 'radial-gradient(#000 1px, transparent 1px)',
			},
			backgroundSize: {
				'dotted-20': '20px 20px',
				'dotted-40': '40px 40px'
			},
			backgroundColor: {
				'dark-bg': '#1a202c', // Couleur de fond sombre
			},
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
