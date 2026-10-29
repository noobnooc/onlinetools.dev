#!/usr/bin/env bash
# The same three gates CI runs (.github/workflows/ci.yml). A change that does
# not pass all three is never pushed, merged or deployed.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
source .claude/skills/autopilot/scripts/env.sh

pnpm test
pnpm check
pnpm build
echo "verify: all gates passed"
