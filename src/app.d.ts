// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
	namespace App {
		interface Locals {
			pb: PocketBase
			security: Security
			user: Admin | Record | null
		}
		interface Error {
			message: string
			id?: string
		}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Window {
		umami?: {
			track: (eventName: string, eventData?: Record<string, any>) => void
		}
	}

}
export { }
