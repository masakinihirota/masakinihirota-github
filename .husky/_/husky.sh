#!/usr/bin/env sh
# Minimal husky helper script used by hooks in this repo
# Ensures hooks run from repository root and early exit if running in CI without Git
export HUSKY=1

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || printf '.')"
cd "$REPO_ROOT" || exit 0

return 0
