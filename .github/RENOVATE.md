# Renovate (self-hosted, free)

Dependency updates run through [Renovate](https://docs.renovatebot.com/) inside this repo's own GitHub Actions, as the `bunestro-renovate` GitHub App. Actions minutes are free and unlimited on public repos, so this costs nothing.

| File                                    | Purpose                                                       |
| :-------------------------------------- | :------------------------------------------------------------ |
| `renovate.json5`                        | What gets updated, when, grouping, automerge rules            |
| `.github/workflows/renovate.yml`        | Runs Renovate every 4 hours (and on demand)                   |
| `.github/workflows/ci.yml`              | `build` check (site + `create-bunestro`) that gates automerge |
| `.github/workflows/renovate-notify.yml` | @mentions you when an Astro major update PR opens             |

## Behaviour

- **Schedule:** new PRs only before 06:00 UTC on Mondays. The runner still wakes every 4 hours to automerge and to act on Dependency Dashboard checkboxes.
- **Grouping:** one PR for all non-major npm updates (site and `create-bunestro`), one for GitHub Actions. Each major npm update gets its own PR; Astro core and `@astrojs/*` majors share one.
- **Automerge:** non-major updates and the weekly lockfile refresh merge automatically, but only after CI passes. Majors always wait for you, and Astro majors are labelled `astro-major` and assigned to you.
- **Release age:** a version must be 3 days old before Renovate proposes it. Security fixes from OSV skip the wait.
- **Actions** are pinned to commit SHAs with a `# vX.Y.Z` comment.
- **Node.js:** the major-only `node-version: "26"` in workflows only moves between even (LTS) majors, as a reviewed PR. `engines.node` in `package.json` is never changed by Renovate; raising it is a deliberate decision.
- **Wrapper:** `packages/bunestro-wrapper` is skipped; the publish workflow keeps its `create-bunestro` dependency in sync.
- **Dependency Dashboard:** an issue titled "Dependency Dashboard" lists everything pending. Tick a checkbox there to get a PR before Monday.

Automerged PRs that touch `packages/create-bunestro/**` start the publish workflow. It skips publishing because `version` is unchanged, so releases still only happen when you bump the version.

## One-time setup

1. **Create a GitHub App** (free): GitHub → Settings → Developer settings → GitHub Apps → New GitHub App.
   - Name: `bunestro-renovate`. Homepage URL: this repo.
   - Webhook: uncheck **Active**.
   - Repository permissions:

     | Permission        | Access         |
     | :---------------- | :------------- |
     | Checks            | Read and write |
     | Commit statuses   | Read and write |
     | Contents          | Read and write |
     | Issues            | Read and write |
     | Pull requests     | Read and write |
     | Workflows         | Read and write |
     | Administration    | Read-only      |
     | Dependabot alerts | Read-only      |
     | Metadata          | Read-only      |

   - Where can this app be installed: **Only on this account**.
2. On the app page, copy the **Client ID**, then **Generate a private key** (downloads a `.pem`).
3. **Install the app** (app page → Install App) on this repository only.
4. In this repo → Settings → Secrets and variables → Actions:
   - **Variables** tab: `RENOVATE_APP_CLIENT_ID` = the Client ID
   - **Secrets** tab: `RENOVATE_APP_PRIVATE_KEY` = the full contents of the `.pem` file
5. Delete the downloaded `.pem`.
6. Actions tab → **Renovate** → **Run workflow** to trigger the first run instead of waiting.

A GitHub App is used instead of a personal access token because it doesn't expire, commits are signed by the bot (so merges show **Verified**), PRs come from the bot instead of you, and PRs it opens still trigger CI. PRs opened with the default `GITHUB_TOKEN` would not trigger CI.

## Troubleshooting

- Run the workflow manually with log level `debug`.
- To validate config changes locally, run `bunx --package renovate renovate-config-validator --strict`.
