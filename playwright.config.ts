import type { PlaywrightTestConfig } from '@playwright/test'

// const baseURL = 'https://adam.nz'
const baseURL = 'http://localhost:5173'

const config: PlaywrightTestConfig = {
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	use: { baseURL },
	webServer: {
		command: 'pnpm dev',
		port: 5173,
		reuseExistingServer: true,
	},
}

export default config

// webServer: {
// 	command: 'pnpm build && pnpm preview',
// 	port: 4173,
// },
