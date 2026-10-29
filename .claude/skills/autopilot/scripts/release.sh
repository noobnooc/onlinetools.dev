#!/usr/bin/env bash
# Follow a merged commit to production and prove it is healthy.
#   release.sh <merged-sha-on-main> <previous-version-id> [expected-site-version]
#
# Merging to main is what deploys: Cloudflare Workers Builds is connected to
# the repo ("Deploy default branch" trigger runs `pnpm build` + `wrangler
# deploy`) and reports back as the "Workers Builds: onlinetools-dev" check.
# This script waits for that build, smoke-tests the live site, and rolls back
# to <previous-version-id> if the site is unhealthy. If the Workers Build
# fails or never shows up, it deploys the same commit with wrangler directly.
# Exit 0 only when the commit is live and the smoke test passes.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)"
source .claude/skills/autopilot/scripts/env.sh
scripts=.claude/skills/autopilot/scripts
sha="${1:?usage: release.sh <sha> <previous-version-id> [expected-site-version]}"
previous="${2:?previous version id required (from live-version.sh)}"
want_version="${3:-}"

CHECK_NAME="Workers Builds" "$scripts/wait-checks.sh" "$sha" 25
build=$?

if [ "$build" != 0 ]; then
	echo "release: Workers Build for $sha did not succeed (exit $build) — deploying it directly with wrangler"
	git fetch origin main --quiet
	workdir="$(mktemp -d)"
	git worktree add --quiet --detach "$workdir" "$sha" || exit 1
	(
		cd "$workdir" &&
		pnpm install --frozen-lockfile >/dev/null &&
		pnpm test && pnpm check && pnpm build &&
		pnpm exec wrangler deploy --message "autopilot: manual deploy of $sha"
	)
	deployed=$?
	git worktree remove --force "$workdir"
	if [ "$deployed" != 0 ]; then
		echo "release: manual deploy failed; checking production is still healthy"
		"$scripts/smoke.sh"
		exit 1
	fi
fi

# Give the edge a moment to serve the new assets.
sleep 20
if "$scripts/smoke.sh" $want_version; then
	echo "release: $sha is live and healthy"
	# CI on main is informational here (the PR head already passed it), but a
	# red main must still be reported.
	CHECK_NAME="test" "$scripts/wait-checks.sh" "$sha" 10 || { echo "release: WARNING — CI on main is not green"; exit 3; }
	exit 0
fi

echo "release: smoke test FAILED — rolling back to $previous" >&2
pnpm exec wrangler rollback "$previous" --message "autopilot: smoke test failed after $sha" --yes
sleep 20
"$scripts/smoke.sh" || true
exit 1
