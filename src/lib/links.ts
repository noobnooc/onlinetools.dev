/**
 * Off-site links — the public repository and the author — centralized so the
 * footer and the About page never drift. The repo is where "view source" and
 * "edit this page" point; keep these in sync with the real GitHub location.
 */
export const REPO_URL = 'https://github.com/noobnooc/onlinetools.dev';
export const AUTHOR_NAME = 'Nooc';
export const AUTHOR_URL = 'https://nooc.me';

/** Deep link to edit a source file on GitHub's web editor (default branch). */
export const editUrl = (path: string): string => `${REPO_URL}/edit/main/${path}`;

/**
 * "Report an issue" deep link for a tool page. Targets the bug-report issue
 * form and pre-fills its `tool` field (matching the input id in
 * .github/ISSUE_TEMPLATE/bug_report.yml) with the exact URL the reporter was
 * on — locale prefix included, since that is often the detail that reproduces
 * the bug. Renaming that field, or the template file, breaks the pre-fill
 * silently: GitHub just opens the form empty.
 */
export const issueUrl = (toolUrl: string): string =>
	`${REPO_URL}/issues/new?template=bug_report.yml&tool=${encodeURIComponent(toolUrl)}`;
