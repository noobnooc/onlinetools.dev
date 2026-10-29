#!/usr/bin/env bash
# Wait for every GitHub check run on a commit to finish.
#   wait-checks.sh <sha> [timeout-minutes, default 25]
# Exit 0 = all passed (success/neutral/skipped), 1 = something failed,
# 2 = timed out or no checks appeared. With CHECK_NAME set, only check runs
# whose name contains it count (e.g. CHECK_NAME="Workers Builds").
# Uses the public API (the repo is public), so it needs no token and works
# inside a plain shell loop.
set -uo pipefail
sha="${1:?usage: wait-checks.sh <sha> [timeout-minutes]}"
timeout_min="${2:-25}"
repo="${AUTOPILOT_REPO:-noobnooc/onlinetools.dev}"
deadline=$(( $(date +%s) + timeout_min * 60 ))

while :; do
	json="$(curl -fsS --max-time 20 "https://api.github.com/repos/$repo/commits/$sha/check-runs?per_page=100" 2>/dev/null || echo '{}')"
	verdict="$(printf '%s' "$json" | python3 -c '
import json, sys
import os
name = os.environ.get("CHECK_NAME", "")
runs = [r for r in json.load(sys.stdin).get("check_runs", []) if name in r["name"]]
for r in runs:
    print("    %s: %s %s" % (r["name"], r["status"], r["conclusion"] or ""), file=sys.stderr)
if not runs:
    print("none")
elif any(r["status"] != "completed" for r in runs):
    print("pending")
elif all(r["conclusion"] in ("success", "neutral", "skipped") for r in runs):
    print("pass")
else:
    print("fail")
')"
	case "$verdict" in
		pass) echo "checks on $sha: passed"; exit 0 ;;
		fail) echo "checks on $sha: FAILED"; exit 1 ;;
	esac
	if [ "$(date +%s)" -ge "$deadline" ]; then
		echo "checks on $sha: timed out after ${timeout_min}m (last state: $verdict)"
		exit 2
	fi
	sleep 30
done
