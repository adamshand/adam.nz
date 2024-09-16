import * as child_process from 'node:child_process'
import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		runes: true,
	},
	kit: {
		adapter: adapter(),
		// fails in Docker build because git not available.
		// version: {
		// 	name: child_process.execSync('git rev-parse HEAD').toString().trim(),
		// },
	},
	preprocess: vitePreprocess(),
}

export default config
