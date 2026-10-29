#!/usr/bin/env bash
# Production smoke test, run after every deploy and at the start of every
# autopilot run. Exit status is the number of failed checks (0 = healthy).
#   smoke.sh                 # check the live site
#   smoke.sh 2026.10.28      # …and require that version in the footer badge
set -uo pipefail

BASE="${SMOKE_BASE:-https://onlinetools.dev}"
WWW="${SMOKE_WWW:-https://www.onlinetools.dev}"
MIN_URLS="${SMOKE_MIN_URLS:-800}"
SAMPLE="${SMOKE_SAMPLE:-30}"
want_version="${1:-}"
failures=0
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

pass() { printf '  ok    %s\n' "$1"; }
fail() { printf '  FAIL  %s\n' "$1"; failures=$((failures + 1)); }
status() { curl -sS -o /dev/null -w '%{http_code}' --max-time 20 "$1" 2>/dev/null || echo 000; }

echo "Smoke test against $BASE"

home_code="$(curl -sS -D "$tmp/home.h" -o "$tmp/home.html" -w '%{http_code}' --max-time 20 "$BASE/" || echo 000)"
[ "$home_code" = 200 ] && pass "home 200" || fail "home returned $home_code"
grep -qi '<meta http-equiv="content-security-policy"' "$tmp/home.html" && pass "CSP meta present" || fail "CSP meta tag missing"
grep -qi '^x-frame-options: *DENY' "$tmp/home.h" && pass "X-Frame-Options DENY" || fail "X-Frame-Options header missing"
grep -qi '^referrer-policy: *no-referrer' "$tmp/home.h" && pass "Referrer-Policy no-referrer" || fail "Referrer-Policy header missing"
live_version="$(grep -o 'v20[0-9][0-9]\.[0-9][0-9]\.[0-9][0-9]' "$tmp/home.html" | head -1)"
echo "  info  live version: ${live_version:-unknown}"
if [ -n "$want_version" ]; then
	[ "$live_version" = "v${want_version#v}" ] && pass "version is $want_version" || fail "expected v${want_version#v}, live is ${live_version:-unknown}"
fi

www="$(curl -sS -o /dev/null -w '%{http_code} %{redirect_url}' --max-time 20 "$WWW/" || echo 000)"
case "$www" in 30[18]\ "$BASE"/*) pass "www redirects to apex" ;; *) fail "www → apex redirect broken ($www)" ;; esac

[ "$(status "$BASE/this-page-should-not-exist-$RANDOM")" = 404 ] && pass "unknown path 404s" || fail "unknown path did not 404"
for path in /robots.txt /sw.js /manifest.webmanifest /favicon.svg /og.png; do
	code="$(status "$BASE$path")"
	[ "$code" = 200 ] && pass "$path 200" || fail "$path returned $code"
done

if curl -sS --max-time 20 "$BASE/sitemap.xml" -o "$tmp/sitemap.xml"; then
	grep -o '<loc>[^<]*' "$tmp/sitemap.xml" | sed 's/<loc>//' > "$tmp/urls"
	count="$(wc -l < "$tmp/urls" | tr -d ' ')"
	[ "$count" -ge "$MIN_URLS" ] && pass "sitemap lists $count URLs" || fail "sitemap lists only $count URLs (min $MIN_URLS)"
	bad=0
	while read -r url; do
		code="$(status "$url")"
		[ "$code" = 200 ] || { echo "        $code $url"; bad=$((bad + 1)); }
	done < <(shuf -n "$SAMPLE" "$tmp/urls")
	[ "$bad" = 0 ] && pass "$SAMPLE random sitemap URLs return 200" || fail "$bad of $SAMPLE sampled sitemap URLs failed"
else
	fail "sitemap.xml unreachable"
fi

echo "Smoke test: $failures failure(s)"
exit "$failures"
