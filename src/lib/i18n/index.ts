/**
 * Localization core. English is the default locale and lives at the URL
 * root (unchanged); every other locale is served under a /{code} prefix.
 * Messages ride along on page.data so they are SSR-safe per page.
 */
import { page } from '$app/state';
import type { ToolCategory, ToolMeta } from '$lib/tools/registry';
import en from './locales/en';

export interface ToolL10n {
	name: string;
	description: string;
}

export interface Messages {
	/** BCP-47 code, also the URL prefix (except en). */
	code: string;
	/** Native language name, shown in the switcher. */
	name: string;
	ui: Record<keyof typeof en.ui, string>;
	categories: Record<ToolCategory, string>;
	tools: Record<string, ToolL10n>;
}

export { EXTRA_LOCALES, LOCALES, isExtraLocale, type Locale } from './codes';
import { LOCALES, isExtraLocale, type Locale } from './codes';

const loaders = import.meta.glob<{ default: Messages }>('./locales/*.ts');

export async function loadMessages(locale: Locale): Promise<Messages> {
	if (locale === 'en') return en;
	const mod = await loaders[`./locales/${locale}.ts`]();
	return mod.default;
}

/** Current locale for the page being rendered. */
export function locale(): Locale {
	return (page.data.locale as Locale) ?? 'en';
}

function messages(): Messages {
	return (page.data.messages as Messages) ?? en;
}

/** UI string lookup with English fallback and {var} interpolation. */
export function t(key: keyof Messages['ui'], vars?: Record<string, string | number>): string {
	let s = messages().ui[key] ?? en.ui[key];
	if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
	return s;
}

/** Localized tool name/description, falling back to the registry English. */
export function lt(tool: ToolMeta): ToolL10n {
	return messages().tools[tool.slug] ?? { name: tool.name, description: tool.description };
}

export function ltCategory(category: ToolCategory): string {
	return messages().categories[category] ?? en.categories[category];
}

/** Prefix a locale-less path for the given (default: current) locale. */
export function lp(path: string, loc: Locale = locale()): string {
	if (loc === 'en') return path;
	return path === '/' ? `/${loc}` : `/${loc}${path}`;
}

/** Strip the locale prefix from a pathname → the canonical en path. */
export function unlp(pathname: string): string {
	const seg = pathname.split('/')[1];
	if (isExtraLocale(seg)) return pathname.slice(seg.length + 1) || '/';
	return pathname;
}

const BASE = 'https://onlinetools.dev';

/** hreflang alternates (absolute), plus x-default → English. */
export function alternates(path: string): Array<{ hreflang: string; href: string }> {
	return [
		...LOCALES.map((l) => ({ hreflang: l, href: BASE + lp(path, l) })),
		{ hreflang: 'x-default', href: BASE + path }
	];
}

export function canonical(path: string, loc: Locale = locale()): string {
	return BASE + lp(path, loc);
}
