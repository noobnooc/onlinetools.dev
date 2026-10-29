# Environment for every autopilot shell command. Source it, don't run it:
#   source .claude/skills/autopilot/scripts/env.sh
# Each Bash call in a cloud session starts a fresh shell, so prefix commands
# with this line rather than relying on an earlier export.

_ap_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
_ap_node_major="$(sed 's/^v//; s/\..*//' "$_ap_root/.nvmrc" 2>/dev/null || echo 26)"
export AUTOPILOT_NODE_DIR="${AUTOPILOT_NODE_DIR:-$HOME/.local/node-$_ap_node_major}"
case ":$PATH:" in *":$AUTOPILOT_NODE_DIR/bin:"*) ;; *) export PATH="$AUTOPILOT_NODE_DIR/bin:$PATH" ;; esac

# Wrangler talks to api.cloudflare.com, where the session proxy injects the
# real credential. Wrangler refuses to start without a token, so it gets a
# placeholder that the proxy replaces. The account is the one that owns the
# onlinetools.dev zone and the onlinetools-dev Worker.
export CLOUDFLARE_ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-b3192aad463ea15f02735c9614aff7a3}"
export CLOUDFLARE_API_TOKEN="${CLOUDFLARE_API_TOKEN:-placeholder-injected-by-proxy}"
[ -f /root/.ccr/ca-bundle.crt ] && export NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt
export WRANGLER_SEND_METRICS=false

unset _ap_root _ap_node_major
