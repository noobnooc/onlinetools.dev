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
	/** Single-tool pages that do one step of this recipe in more depth (registry slugs). */
	tools: string[];
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
		recipe: { input: SAMPLE_JWT, steps: [{ op: 'jwt-payload' }] },
		tools: ['jwt-decoder', 'json-formatter']
	},
	{
		slug: 'extract-jwt-claim',
		title: 'Extract one claim from a JWT',
		heading: 'Extract a single claim from a JWT',
		description:
			'Decode a JWT and pull out one claim (like sub or name) with a JSONPath, in one flow. All local — the token never leaves your browser.',
		intro:
			'Decode a JSON Web Token and pull a single claim straight out with a JSONPath expression — change $.name to $.sub, $.exp or any claim you need. Everything runs locally.',
		recipe: { input: SAMPLE_JWT, steps: [{ op: 'jwt-payload' }, { op: 'jsonpath', arg: '$.name' }] },
		tools: ['jwt-decoder', 'jsonpath-tester']
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
		},
		tools: ['base64-decode', 'json-formatter']
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
		},
		tools: ['json-to-yaml', 'json-formatter']
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
		},
		tools: ['json-to-csv', 'json-formatter']
	},
	{
		slug: 'wireguard-allowedips-exclude-lan',
		title: 'WireGuard AllowedIPs without the LAN',
		heading: 'WireGuard AllowedIPs: route everything except your LAN',
		description:
			'Compute a WireGuard AllowedIPs line that sends all traffic through the tunnel except private and local ranges. Edit the exclusions; runs in your browser.',
		intro:
			'AllowedIPs = 0.0.0.0/0 sends everything through the tunnel, including traffic to your printer and router. WireGuard has no "except" syntax, so this pipeline subtracts the ranges you list (private IPv4, IPv6 unique-local and link-local by default) and joins the remaining blocks into one line you can paste into the [Peer] section.',
		recipe: {
			input: '0.0.0.0/0\n::/0',
			steps: [
				{ op: 'cidr-aggregate', arg: '10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, fc00::/7, fe80::/10' },
				{ op: 'join-lines', arg: ', ' }
			]
		},
		tools: ['cidr-calculator']
	},
	{
		slug: 'merge-ip-ranges-into-cidrs',
		title: 'Merge IP ranges into CIDR blocks',
		heading: 'Merge a list of IPs and ranges into the fewest CIDR blocks',
		description:
			'Paste IP addresses, CIDR blocks and ranges and get the smallest list of CIDR blocks that covers exactly the same addresses. IPv4 and IPv6, all local.',
		intro:
			'Allowlists and firewall rules grow by accretion: single addresses, overlapping blocks, a range someone typed by hand. This pipeline merges them into the fewest CIDR blocks covering exactly the same addresses, IPv4 first, then IPv6. Add exclusions to the step if some addresses must stay out.',
		recipe: {
			input: '10.0.0.0/24\n10.0.1.0/24\n10.0.0.17\n192.168.1.10 - 192.168.1.20\n2001:db8::/33\n2001:db8:8000::/33',
			steps: [{ op: 'cidr-aggregate' }]
		},
		tools: ['cidr-calculator']
	},
	{
		slug: 'remove-duplicate-lines-and-sort',
		title: 'Remove duplicate lines and sort',
		heading: 'Remove duplicate lines and sort the rest',
		description:
			'Paste a list, drop the duplicate lines and sort what is left, in one step. Runs entirely in your browser; nothing you paste is uploaded.',
		intro:
			'Paste a list of emails, hostnames, IDs or anything one-per-line. This pipeline trims the surrounding whitespace, keeps the first copy of every line and sorts the result. Add a "Join lines" step to turn it into one comma-separated line.',
		recipe: {
			input: 'beta.example.com\nalpha.example.com\nbeta.example.com\ngamma.example.com\nalpha.example.com',
			steps: [{ op: 'trim' }, { op: 'dedupe-lines' }, { op: 'sort-lines' }]
		},
		tools: ['sort-lines']
	}
];

export const PRESET_BY_SLUG = new Map(CHAIN_PRESETS.map((p) => [p.slug, p]));
