import { TOOLS, CATEGORY_LABELS } from '$lib/tools/registry';

/**
 * English — the canonical message catalog. The registry already carries
 * English tool names/descriptions, so they are derived, not duplicated.
 * Every other locale file mirrors this shape (checked by the Messages type).
 */
const en = {
	code: 'en',
	name: 'English',
	ui: {
		// Chrome
		search: 'Search',
		overview: 'Overview',
		toggleTheme: 'Toggle color theme',
		themeSystem: 'Follow system',
		themeDark: 'Dark',
		themeLight: 'Light',
		themeTitle: 'Theme: {mode} — click to switch',
		footerPrivacy: 'Runs in your browser — nothing you paste is uploaded',
		allTools: 'All tools',
		changelog: 'Changelog',
		releaseDate: 'Release date',
		language: 'Language',
		openNav: 'Open navigation',
		searchTools: 'Search tools',

		// Home
		homeTitle: 'onlinetools.dev — Developer tools that run in your browser',
		homeMetaDescription:
			'Fast, keyboard-first developer tools that run entirely in your browser. Format JSON, decode JWTs and Base64, convert timestamps, test regex — no upload, no signup, works offline.',
		homeEyebrow: '{n} tools · local-first',
		homeHeading: 'Developer tools that run in your browser',
		homeSub: 'No upload, no signup, no waiting.',
		pasteToDetect: 'paste to detect',
		worksOffline: 'works offline',
		shortcuts: 'shortcuts',
		searchPlaceholder: 'Search {n} tools, or paste anything…',
		startHere: 'Start here',
		smartPaste: 'Smart Paste',
		smartPasteDesc:
			'Paste anything, anywhere — the content type is detected and the right tool is one keystroke away.',
		keyboardFirst: 'Keyboard-first, end to end',
		keyboardFirstDesc: 'Find, run, copy and share without touching the mouse.',
		kbdAnyTool: 'any tool',
		kbdCopyResult: 'copy result',
		kbdConfirm: 'confirm',
		kbdAllShortcuts: 'all shortcuts',

		// Tools index page
		toolsTitle: 'All developer tools — onlinetools.dev',
		toolsMetaDescription:
			'Browse every tool on onlinetools.dev: JSON, YAML, Base64, JWT, timestamps, cron, regex, diff, UUID, hashing, QR codes and more — all running locally in your browser.',
		toolsBlurb: '{n} tools, every one computed in your browser. More arriving steadily — see the',

		// Tool page shell
		toolTitle: '{name} — Free & Private | onlinetools.dev',
		toolMetaSuffix: 'Runs entirely in your browser — no upload, no signup, works offline.',
		runsLocally: 'Runs locally',
		runsLocallyTitle:
			'This tool computes everything in your browser. Your input is never uploaded.',
		aboutTool: 'About this tool',
		faqHeading: 'Frequently asked questions',
		relatedTools: 'Related tools',
		breadcrumbTools: 'tools',

		// Shared tool components
		sample: 'Sample',
		line: 'line',
		output: 'Output',
		copy: 'Copy',
		copied: 'Copied',
		download: 'Download',
		share: 'Share',
		linkCopied: 'Link copied',
		continueWith: 'Continue with',
		suggested: 'suggested',
		shareTooLarge:
			'Input too large for a URL — share links are capped so they stay portable. Content never leaves this machine.',
		emptyHint: 'Output appears here as you type',

		// Command palette
		palettePlaceholder: 'Search tools, or paste content to act on it…',
		noMatch: 'No matching tool',
		navigate: 'navigate',
		open: 'open',
		close: 'close',

		// Smart paste
		detected: 'Detected',
		chars: 'chars',

		// Shortcut help
		shortcutsTitle: 'Keyboard shortcuts',
		scPalette: 'Open command palette',
		scCopy: 'Copy result',
		scEsc: 'Close panel / dismiss suggestion',
		scHelp: 'This shortcut reference',
		scPaste: 'Smart Paste — detect content and suggest tools',
		scNav: 'Navigate and confirm in panels'
	},
	categories: CATEGORY_LABELS,
	tools: Object.fromEntries(
		TOOLS.map((t) => [t.slug, { name: t.name, description: t.description }])
	)
};

export default en;
