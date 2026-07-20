// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {
		interface Platform {
			env?: {
				ASSETS: Fetcher;
			};
			context?: ExecutionContext;
		}
	}
}

export {};
