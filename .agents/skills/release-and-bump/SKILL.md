---
name: release-and-bump
description:
  Release effect-evm-v4 to npm and optionally update a downstream consumer explicitly named by the user. Use when the
  user asks to release, publish, publish and bump, or verify a release of effect-evm-v4.
---

# Release and Bump

Release `effect-evm-v4` from `evm/`. Do not use the upstream `@prb/effect-*`, `ccbump`, or `~/sablier/new-ui` workflows.

## 1. Confirm Scope and Version

1. Read `evm/package.json` and `evm/CHANGELOG.md`.
2. Confirm the package name is `effect-evm-v4` and the requested version matches both files.
3. Inspect `git status`, staged changes, remotes, and the current branch. Do not stage unrelated files or publish a
   mixed, unreviewed worktree.
4. Confirm `origin` points to `hellowodl/effect-evm-v4` and `upstream` points to `PaulRBerg/prb-effect`.

## 2. Validate the Package

Run the repository gates in order:

```bash
just type-check evm
just evm::test
cd evm
npm pack --dry-run
```

Confirm the tarball metadata, public exports, LICENSE, NOTICE, and README. Confirm no test files, secrets, or `catalog:`
ranges are published, and confirm internal implementation paths are not publicly resolvable. Stop on any failure.

## 3. Verify npm Access

Run:

```bash
npm whoami
npm view effect-evm-v4@<version> version
```

Authentication must be configured privately by the user. Never request or print an npm token. For a first release, a
not-found response is expected; for later releases, stop if the version already exists.

## 4. Publish Source

Commit only the reviewed release files and push them to `origin` before publishing npm artifacts. Do not push when the
worktree scope is ambiguous. Create the matching GitHub tag or release only when the user requested it.

## 5. Publish npm Package

Run from `evm/`, never the repository root:

```bash
npm publish --tag latest
```

Then verify the immutable published version:

```bash
npm view effect-evm-v4@<version> version
```

## 6. Update a Consumer Only When Named

Read `references/consumer-map.md`. Do not infer a consumer repository. If the user explicitly names one, update its
dependency and migrate imports from `@prb/effect-evm` or `effect-evm` to `effect-evm-v4`, then run that repository's
quality gates. Do not commit consumer changes unless explicitly requested.

## 7. Report

Report the Git commit and tag, npm package/version URL, validation results, and any consumer files changed.
