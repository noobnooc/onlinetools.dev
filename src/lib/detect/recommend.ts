import { TOOLS } from '$lib/tools/registry';
import { formatAffinity } from './formats';
import type { Detection } from './detectors';

/**
 * Unified tool ranking shared by "Continue with" and Smart Paste.
 *
 * Every tool is scored `detection confidence × format affinity`, so tools
 * whose declared input matches the detected format exactly come first, tools
 * that merely accept plain text follow via the format fallback chain, and
 * pure generators (no input) sink to the bottom in registry order.
 */

export interface RankedTool {
	slug: string;
	/** 0..1 relevance. 0 = no input relationship to the content at all. */
	score: number;
	/** Confident, format-specific match — worth a "suggested" badge. */
	suggested: boolean;
	/** Curated action label from a detector, e.g. "Decode". */
	action?: string;
}

/** Score at or above which a match is confident enough to badge. */
const SUGGESTED_MIN = 0.55;

/**
 * Implicit "it is at least text" confidence, injected so text-accepting tools
 * always outrank generators — but stay below any format-specific match.
 */
const TEXT_BASELINE = 0.4;

/** Minimum score for a tool to appear in the Smart Paste panel. */
export const PASTE_MIN = 0.45;

export function rankTools(
	detections: Detection[],
	opts: { exclude?: string; baselineText?: boolean } = {}
): RankedTool[] {
	const { exclude, baselineText = true } = opts;
	const ds: Detection[] = [...detections];
	const binary = ds.some((d) => d.format === 'image');
	if (baselineText && !binary) {
		ds.push({
			type: 'text',
			format: 'text',
			label: 'Text',
			confidence: TEXT_BASELINE,
			tool: '',
			actions: []
		});
	}
	return TOOLS.filter((t) => t.slug !== exclude)
		.map((tool) => {
			let score = 0;
			let action: string | undefined;
			for (const d of ds) {
				const affinity = tool.accepts?.length ? formatAffinity(d.format, tool.accepts) : 0;
				let s = d.confidence * affinity;
				// Curated detector actions guarantee at least a full-confidence
				// match, slightly discounted by action position.
				const at = d.actions.findIndex((a) => a.tool === tool.slug);
				if (at !== -1) s = Math.max(s, d.confidence * (1 - 0.05 * at));
				if (s > score) {
					score = s;
					action = at !== -1 ? d.actions[at].label : undefined;
				}
			}
			return { slug: tool.slug, score, suggested: score >= SUGGESTED_MIN, action };
		})
		.sort((a, b) => b.score - a.score); // stable: ties keep registry order
}
