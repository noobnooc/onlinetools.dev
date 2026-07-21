/**
 * One-shot, in-memory handoff of content between routes, used by Smart Paste
 * and "Continue with" when the payload cannot travel in the URL fragment —
 * files always, and text larger than MAX_SHARED_INPUT. Consumed exactly once
 * by the destination tool on mount; deliberately not persisted anywhere.
 */

let pendingState: Record<string, string> | null = null;
let pendingFile: File | null = null;

export function setPendingState(state: Record<string, string>) {
	pendingState = state;
}

export function takePendingState(): Record<string, string> | null {
	const s = pendingState;
	pendingState = null;
	return s;
}

export function setPendingFile(file: File) {
	pendingFile = file;
}

export function takePendingFile(): File | null {
	const f = pendingFile;
	pendingFile = null;
	return f;
}
