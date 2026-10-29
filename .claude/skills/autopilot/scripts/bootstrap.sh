#!/usr/bin/env bash
# Prepare a fresh cloud container for autopilot work: the Node major pinned in
# .nvmrc (the container usually ships an older one), pnpm via corepack, deps.
# Idempotent — a second run only re-checks.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
source .claude/skills/autopilot/scripts/env.sh

want="$(sed 's/^v//; s/\..*//' .nvmrc)"
have="$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)"

if [ "$have" -lt "$want" ]; then
	version="$(curl -fsSL https://nodejs.org/dist/index.json |
		python3 -c "import json,sys; print(next(r['version'] for r in json.load(sys.stdin) if r['version'].startswith('v$want.')))")"
	echo "Installing Node $version into $AUTOPILOT_NODE_DIR"
	tmp="$(mktemp -d)"
	curl -fsSL "https://nodejs.org/dist/$version/node-$version-linux-x64.tar.xz" -o "$tmp/node.tar.xz"
	mkdir -p "$AUTOPILOT_NODE_DIR"
	tar -xJf "$tmp/node.tar.xz" -C "$AUTOPILOT_NODE_DIR" --strip-components=1
	rm -rf "$tmp"
fi

corepack enable --install-directory "$AUTOPILOT_NODE_DIR/bin" >/dev/null 2>&1 || true
COREPACK_ENABLE_DOWNLOAD_PROMPT=0 pnpm --version >/dev/null
pnpm install --frozen-lockfile

echo "node $(node -v) · pnpm $(pnpm -v) · wrangler $(pnpm exec wrangler --version 2>/dev/null | tail -1)"
