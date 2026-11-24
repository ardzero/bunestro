#!/bin/sh
# Vercel "Ignored Build Step". Exit 0 skips the build, exit 1 builds.
# Set in Vercel > Settings > Git: sh .github/scripts/vercel-ignore.sh
msg=$VERCEL_GIT_COMMIT_MESSAGE
prev=$VERCEL_GIT_PREVIOUS_SHA

# npm publish commits and explicit opt-outs
printf '%s\n' "$msg" | grep -qE '^pack:|\[skip deploy\]' && exit 0

# Renovate PR branches
case $VERCEL_GIT_COMMIT_REF in renovate/*) exit 0 ;; esac

# Bot commits (Renovate automerges, workflow commits) deploy only for security fixes.
# Renovate marks them "[SECURITY]" in the title and "-vulnerability" in the branch name.
case $VERCEL_GIT_COMMIT_AUTHOR_LOGIN in
  *\[bot\]|renovate-bot) printf '%s\n' "$msg" | grep -qiE '\[security\]|vulnerab' || exit 0 ;;
esac

# Skip when nothing the site uses changed since the last deployment (README/docs-only pushes).
# A missing or unreachable previous SHA makes git diff fail, so the build proceeds.
[ -n "$prev" ] && git diff --quiet "$prev" HEAD -- . ':!*.md' ':!docs/' ':!.github/' ':!.agents/' ':!.vscode/' ':!packages/' && exit 0
exit 1
