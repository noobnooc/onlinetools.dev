# ops/

Working memory for the **autopilot** — the daily scheduled Claude session that
runs this site (see [`.claude/skills/autopilot/SKILL.md`](../.claude/skills/autopilot/SKILL.md)).
Each run starts in a fresh container with no recollection of yesterday; these
files are how it remembers. Nothing in this folder is built into the site.

| File | What it holds | Who writes it |
| --- | --- | --- |
| [`journal.md`](journal.md) | One entry per run, newest first: what was done, shipped, learned, left open | Every run |
| [`backlog.md`](backlog.md) | Prioritized ideas and known work, with impact/effort | Every run (add, re-rank, close) |
| [`metrics.md`](metrics.md) | Daily traffic and health numbers from Cloudflare | Every run |
| [`cloudflare-changes.md`](cloudflare-changes.md) | Every change made through the Cloudflare API, with the value before it, so it can be undone | Any run that touches Cloudflare |

Humans are welcome to edit any of these — a line added to the top of
`backlog.md` is the simplest way to steer the next run.
