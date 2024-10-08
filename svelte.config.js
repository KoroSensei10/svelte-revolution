// import adapter from '@sveltejs/adapter-auto';
import adapter from 'svelte-adapter-bun';
const config = {
	compilerOptions: {
		runes: true,
	},
	vitePlugin: {
		dynamicCompileOptions({ filename }) {
			if (filename.includes('node_modules')) {
				return { runes: undefined };
			}
		}
	},
	kit: {
		adapter: adapter(), // See https://kit.svelte.dev/docs/adapters
		alias: {
			$components: './src/components',
			$stores: './src/stores',
			$types: './src/types'
		}
	}
};

export default config;
