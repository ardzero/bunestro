# Renovate

Dependency updates come from [Renovate](https://docs.renovatebot.com/) running as the **Sora** GitHub App. The runner, its credentials and the shared update policy all live in [`ardzero/sora-renovate`](https://github.com/ardzero/sora-renovate). This repo only holds its own config.

| File                                    | Purpose                                                                            |
| :-------------------------------------- | :--------------------------------------------------------------------------------- |
| `renovate.json5`                        | Extends the shared weekly preset, plus bunestro's own rules                        |
| `.github/workflows/ci.yml`              | `build` check (site + `create-bunestro`) that gates automerge                      |
| `.github/workflows/renovate-notify.yml` | @mentions you when an Astro major update PR opens                                  |

## Behaviour

From the shared `github>ardzero/sora-renovate:weekly` preset (details in that repo's README):

- New PRs only open on Mondays (UTC); the whole day counts. The runner is scheduled hourly, but GitHub currently starts scheduled runs hours late, so automerges and Dependency Dashboard checkboxes can take a while. To act now, run the Renovate workflow in `ardzero/sora-renovate` by hand.
- One PR for all non-major npm updates (site and `create-bunestro`), one for GitHub Actions, both automerged once CI passes. Each major npm update gets its own PR; major GitHub Actions and workflow Node.js updates share one PR. Majors always wait for you.
- Releases must be 3 days old; security fixes skip the wait. Actions are pinned to commit SHAs.
- Workflow `node-version` only moves between even (LTS) majors. `engines.node` is never changed.

bunestro's own rules:

- **Astro majors:** core and `@astrojs/*` share one PR, labelled `astro-major` and assigned to you, never automerged.
- **Wrapper:** `packages/bunestro-wrapper` is skipped; the publish workflow keeps its `create-bunestro` dependency in sync.

Automerged PRs that touch `packages/create-bunestro/**` start the publish workflow. It skips publishing because `version` is unchanged, so releases still only happen when you bump the version.

To get a PR before Monday, tick its checkbox in the "Dependency Dashboard" issue. To validate config changes locally, run `bunx --package renovate renovate-config-validator --strict`.
