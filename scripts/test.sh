#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(dirname "$0")/.. # repo root
cd "$ROOT_DIR"

# Cleanup function to be called on exit
cleanup() {
  echo "Cleaning up..."
  # 1. Remove any test-generated content in the temporary modules dir
  if [ -d modules ]; then
    rm -rf modules/test_* modules/a modules/index modules/profile modules/modules_backup_*
  fi
  
  # 2. Restore the original modules dir if we backed it up
  if [ -n "${MODULES_BACKUP:-}" ] && [ -d "$MODULES_BACKUP" ]; then
    # Remove the empty/messy temporary modules dir first
    rm -rf modules
    # Restore the original
    mv "$MODULES_BACKUP" modules
    echo "Restored original modules directory."
  fi
  
  # 3. Final safety sweep for any failed backups in root
  rm -rf modules_backup_*
}

# Initial cleanup of any crumbs from previous failed runs
rm -rf modules/test_* modules/a modules/index modules/profile modules/modules_backup_*

# Temporarily move real modules/ out of the way
MODULES_BACKUP="modules_backup_$(date +%s%N)"
if [ -d modules ]; then
  mv modules "${MODULES_BACKUP}"
fi
mkdir -p modules

# Ensure cleanup runs on exit
trap cleanup EXIT

if [[ "${1-}" == "--coverage" ]]; then
  rm -rf cov_profile
  # run all core and middleware tests
  deno test --unstable-kv --allow-net --allow-read --allow-write --allow-env --coverage=cov_profile core/ middlewares/
  # generate lcov
  deno coverage cov_profile --lcov --include=core --include=middlewares --exclude=modules --exclude="modules/**" > cov_profile/raw_lcov.info
  awk 'BEGIN{skip=0} /^SF:/{ if ($0 ~ "/modules/") { skip=1 } else { skip=0; print } next } { if (!skip) print }' cov_profile/raw_lcov.info > cov_profile/lcov.info
  cp cov_profile/lcov.info coverage.lcov
  deno coverage cov_profile --include=core --include=middlewares --exclude=modules --exclude="modules/**" || true
  rm -rf cov_profile
else
  # run all core and middleware tests
  deno test --unstable-kv --allow-net --allow-read --allow-write --allow-env core/ middlewares/
fi
