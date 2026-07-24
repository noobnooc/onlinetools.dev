import type { Recipe } from './types';

/**
 * Curated pipeline recipes, each exposed as its own indexable page under
 * `/chain/<slug>`. These target workflow-intent queries ("decode a JWT and
 * read its payload", "convert JSON to YAML") that the single-tool pages don't
 * — the SEO angle of the pipeline. Copy is English-only for now; the page
 * chrome around it is localized. Every recipe is exercised by the engine test.
 */
export interface ChainPreset {
	/** URL slug under /chain/. */
	slug: string;
	/** Short label for starter chips. */
	title: string;
	/** H1 / SEO title base — phrased as the task. */
	heading: string;
	/** Meta description. */
	description: string;
	/** One-paragraph explanation shown on the page. */
	intro: string;
	recipe: Recipe;
}

const SAMPLE_JWT =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export const CHAIN_PRESETS: ChainPreset[] = [
	{
		slug: 'decode-jwt-payload',
		title: 'Decode a JWT and read its payload',
		heading: 'Decode a JWT and read its payload',
		description:
			'Paste a JWT and read its decoded JSON payload — the claims, issued-at and expiry. Runs entirely in your browser; the token is never uploaded.',
		intro:
			'Paste a JSON Web Token and this pipeline decodes it to the JSON payload — every claim laid out and pretty-printed. Nothing leaves your browser, so it is safe for real tokens.',
		recipe: { input: SAMPLE_JWT, steps: [{ op: 'jwt-payload' }] }
	},
	{
		slug: 'extract-jwt-claim',
		title: 'Extract one claim from a JWT',
		heading: 'Extract a single claim from a JWT',
		description:
			'Decode a JWT and pull out one claim (like sub or name) with a JSONPath, in one flow. All local — the token never leaves your browser.',
		intro:
			'Decode a JSON Web Token and pull a single claim straight out with a JSONPath expression — change $.name to $.sub, $.exp or any claim you need. Everything runs locally.',
		recipe: { input: SAMPLE_JWT, steps: [{ op: 'jwt-payload' }, { op: 'jsonpath', arg: '$.name' }] }
	},
	{
		slug: 'base64-decode-to-json',
		title: 'Base64-decode, then prettify JSON',
		heading: 'Base64-decode a string and prettify the JSON',
		description:
			'Decode a Base64 string and pretty-print the JSON inside it in one step. Runs in your browser — nothing you paste is uploaded.',
		intro:
			'Got a Base64 blob that hides some JSON? This pipeline decodes it and pretty-prints the result so you can actually read it — all in your browser.',
		recipe: {
			input: 'eyJ1c2VyIjp7Im5hbWUiOiJBZGEiLCJyb2xlcyI6WyJhZG1pbiIsImRldiJdfX0=',
			steps: [{ op: 'base64-decode' }, { op: 'json-pretty' }]
		}
	},
	{
		slug: 'json-to-yaml',
		title: 'Convert JSON to YAML',
		heading: 'Convert JSON to YAML',
		description:
			'Paste JSON and convert it to YAML instantly. Runs entirely in your browser — no upload, no signup.',
		intro:
			'Paste JSON and get clean YAML back — handy for config files and Kubernetes manifests. The conversion runs entirely in your browser.',
		recipe: {
			input: '{"name":"Ada","roles":["admin","dev"],"active":true}',
			steps: [{ op: 'json-to-yaml' }]
		}
	},
	{
		slug: 'json-array-to-csv',
		title: 'Flatten a JSON array into CSV',
		heading: 'Flatten a JSON array into CSV',
		description:
			'Turn an array of JSON objects into CSV with flattened columns, ready for a spreadsheet. Runs locally in your browser.',
		intro:
			'Turn an array of JSON objects into a CSV table — nested keys are flattened into dotted columns, ready to drop into a spreadsheet. Runs locally.',
		recipe: {
			input: '[{"id":1,"name":"Ada"},{"id":2,"name":"Alan"}]',
			steps: [{ op: 'json-to-csv' }]
		}
	}
];

export const PRESET_BY_SLUG = new Map(CHAIN_PRESETS.map((p) => [p.slug, p]));
