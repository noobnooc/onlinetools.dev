#!/usr/bin/env bash
# Print the Worker version id currently serving 100% of production traffic.
# Record it before merging anything — it is what release.sh rolls back to.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
source .claude/skills/autopilot/scripts/env.sh
pnpm exec wrangler deployments status --json 2>/dev/null |
	python3 -c "import json,sys; d=json.load(sys.stdin); print(max(d['versions'], key=lambda v: v['percentage'])['version_id'])"
