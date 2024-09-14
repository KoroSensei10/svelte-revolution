/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {}
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'active', 'checked']
  },
  plugins: []
};