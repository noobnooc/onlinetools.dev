# Security Policy

## The short version

onlinetools.dev runs **entirely in your browser**. There is no backend, no
account system, no database and no analytics — so there is no server-side store
of user data that could be breached, and no API to abuse.

That makes the interesting attack surface unusually narrow, and unusually
important:

## Reports we especially want

| | |
| --- | --- |
| 🚨 **Any tool making a network request with your input** | This must never happen. It would falsify the central promise of the site. Treat it as the highest-severity bug here, even if nothing "leaks" in your test. |
| 🚨 **Abuse of a share link (`#s=…`)** | The URL fragment carries attacker-chosen content that some tools render. Anything that turns a share link into stored XSS, a credential-harvesting page, or a way to exfiltrate what someone else has typed. |
| ⚠️ **A CSP or header bypass** | Executing script, submitting a form, framing the site, or reaching a third-party origin despite `default-src 'self'` / `form-action 'none'` / `X-Frame-Options: DENY`. |
| ⚠️ **Wrong crypto or wrong output** | Hashes, bcrypt, JWT signature verification, the password generator's entropy estimate, or the EXIF remover leaving metadata behind. Silently wrong security output is worse than an error. |
| ⚠️ **Service-worker cache poisoning** | Anything that makes the cached app serve content it shouldn't. |
| ⚠️ **Supply chain** | A dependency that phones home, or one whose license or provenance is a problem for a site that ships its minified code to every visitor. |

## Reporting a vulnerability

**Preferred:** [open a private security advisory](https://github.com/noobnooc/onlinetools.dev/security/advisories/new)
on GitHub. That keeps the report confidential while it's being fixed.

If you can't use advisories, email **nooc@nooc.me** with `[security]` in the
subject. Please don't open a public issue for anything exploitable against
people using the live site.

Include, as far as you can:

- What you did — ideally a share link or exact input that reproduces it
- Browser and version
- What you expected versus what happened
- Impact as you see it

Preferred languages: English or 中文.

### What to expect

This is a solo-maintained project, so timelines are best-effort, not an SLA:

| | |
| --- | --- |
| Acknowledgement | within 72 hours |
| Initial assessment | within a week |
| Fix for a confirmed high-severity issue | as fast as I can, usually days |
| Credit | in the changelog and the advisory, unless you'd rather stay anonymous |

There is no bug bounty. I'd still very much like to hear from you.

## Scope

**In scope:** the code in this repository and the live site at
`onlinetools.dev` (including `www.`).

**Out of scope:**

- Findings from automated scanners with no demonstrated impact — especially
  "missing" headers on static assets, or the absence of a server-side control
  on a site with no server.
- Missing `Strict-Transport-Security`, DNSSEC, email/SPF findings for the
  domain, and other infrastructure-level reports that aren't reachable through
  this codebase.
- Denial of service, volumetric testing, or anything that degrades the site for
  other people.
- Social engineering, physical attacks, or attacks against Cloudflare or GitHub
  themselves.
- Self-XSS that requires pasting attacker-supplied code into DevTools.
- "The tool accepts malicious input" — these are format tools; they're
  *supposed* to process hostile-looking input. The bug is only real if
  processing it does something beyond showing you a result.

## Please don't

Test only against your own browser and your own data. Don't attempt to access
other people's data, don't run automated scans against the live domain, and
don't publicly disclose before a fix has shipped. Good-faith research that
stays inside those lines is welcome, and I won't pursue any action over it.

## Supported versions

The site is continuously deployed; only the currently deployed version is
supported, and fixes ship to it directly. Version stamps are dates (see
`src/lib/version.ts`) rather than semver — there are no maintained release
branches to backport to.

## Machine-readable

`https://onlinetools.dev/.well-known/security.txt`
([source](static/.well-known/security.txt))
