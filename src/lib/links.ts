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
