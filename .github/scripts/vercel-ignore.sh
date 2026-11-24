#!/bin/sh
# Vercel "Ignored Build Step". Exit 0 skips the build, exit 1 builds.
# Set in Vercel > Settings > Git: sh .github/scripts/vercel-ignore.sh
msg=$VERCEL_GIT_COMMIT_MESSAGE
prev=$VERCEL_GIT_PREVIOUS_SHA

# npm publish commits and explicit opt-outs
printf '%s\n' "$msg" | head -n 1 | grep -qE '^pack:|\[skip deploy\]' && exit 0

is_automation_login() {
  case $1 in
    *renovate*|github-actions\[bot\]) return 0 ;;
    *) return 1 ;;
  esac
}

needs_bot_build() {
  printf '%s\n' "$1" | grep -qiE '\[security\]|vulnerab|lock[ -]file[ -]maintenance'
}

# Routine Renovate previews skip, but security and lock maintenance get a build.
case $VERCEL_GIT_COMMIT_REF in
  renovate/*)
    needs_bot_build "$msg" && exit 1
    needs_bot_build "$VERCEL_GIT_COMMIT_REF" && exit 1
    exit 0
    ;;
esac

# Vercel supplies a full GitHub commit SHA, not a Git revision expression.
[ "${#prev}" -eq 40 ] || exit 1
case $prev in *[!0123456789abcdefABCDEF]*) exit 1 ;; esac

# Skip only a recent, uninterrupted run of routine automation commits.
if is_automation_login "$VERCEL_GIT_COMMIT_AUTHOR_LOGIN"; then
  needs_bot_build "$msg" && exit 1
  git merge-base --is-ancestor "$prev" HEAD || exit 1
  deployed_at=$(git log -1 --format=%ct "$prev") || exit 1
  now=$(date +%s) || exit 1
  [ "$((now - deployed_at))" -le 604800 ] || exit 1

  # A shallow side branch can hide earlier commits even if the base is reachable.
  roots=$(git rev-list --max-parents=0 "$prev..HEAD") || exit 1
  [ -z "$roots" ] || exit 1
  commits=$(git log --format=%H "$prev..HEAD") || exit 1
  newline='
'
  for commit in $commits; do
    entry=$(git log -1 --format='%ae%n%B' "$commit") || exit 1
    email=${entry%%"$newline"*}
    case $email in
      *@users.noreply.github.com)
        login=${email%@*}
        is_automation_login "${login#*+}" || exit 1
        ;;
      *) exit 1 ;;
    esac
    needs_bot_build "${entry#*"$newline"}" && exit 1
  done
  exit 0
fi

# Skip when nothing the site uses changed since the last deployment (README/docs-only pushes).
# A missing or unreachable previous SHA makes git diff fail, so the build proceeds.
git diff --quiet "$prev" HEAD -- . ':!*.md' ':!docs/' ':!.github/' ':!.agents/' ':!.vscode/' ':!packages/' && exit 0
exit 1
