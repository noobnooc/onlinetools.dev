<!--
Thanks for contributing! Delete any section that doesn't apply.
First time here? CONTRIBUTING.md is short and will save us both a review round.
-->

## What this changes

<!-- One or two sentences. If it fixes an issue: "Fixes #123". -->

## Why

<!-- The problem, the wrong output, the missing capability. What did you hit? -->

## How

<!-- Anything a reviewer would otherwise have to reverse-engineer: a tricky
     edge case, why you chose this approach over the obvious one, a dependency
     you added and what it replaced. -->

## Checklist

- [ ] `pnpm test` passes
- [ ] `pnpm check` reports 0 errors
- [ ] `pnpm build` prerenders cleanly
- [ ] New or changed logic has unit tests (including malformed and non-ASCII input)
- [ ] **No new network request at runtime** — the site makes zero after load
- [ ] No new non-permissive dependency (no (A)GPL); heavy ones are dynamically imported
- [ ] Tool logic stayed in `src/lib/tools/` as pure functions, out of components
- [ ] Works in both dark and light themes
- [ ] Keyboard reachable, focus visible, controls labeled
- [ ] Any new UI string goes through `t()` / `tt()` and exists in every locale file
- [ ] Changelog updated if this is user-visible (site page + `CHANGELOG.md`)

## Screenshots

<!-- Required for anything visual. Both themes, please. -->

## Notes for the reviewer

<!-- Known limitations, follow-ups you deliberately left out, things you're
     unsure about. Saying "I wasn't sure about X" is welcome, not a weakness. -->
