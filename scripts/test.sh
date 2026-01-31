#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(dirname "$0")/.. # repo root
cd "$ROOT_DIR"

if [[ "${1-}" == "--coverage" ]]; then
  rm -rf cov_profile
  # Temporarily move real modules/ out of the way so tests don't auto-import them
  MODULES_BACKUP="modules_backup_$(date +%s%N)"
  if [ -d modules ]; then
    mv modules "${MODULES_BACKUP}"
  fi
  mkdir -p modules

  # run all core tests (loader.test.ts creates its own test modules)
  deno test --allow-net --allow-read --allow-write --coverage=cov_profile core/coverage.test.ts core/router.test.ts core/server.test.ts core/loader.test.ts
  # generate raw lcov and filter out any records that come from the modules folder
  deno coverage cov_profile --lcov --include=core --exclude=modules --exclude=modules/** > cov_profile/raw_lcov.info
  awk 'BEGIN{skip=0} /^SF:/{ if ($0 ~ "/modules/") { skip=1 } else { skip=0; print } next } { if (!skip) print }' cov_profile/raw_lcov.info > cov_profile/lcov.info
  # copy filtered lcov to repo root for CI/tools and print a human summary limited to core
  cp cov_profile/lcov.info coverage.lcov
  deno coverage cov_profile --include=core --exclude=modules --exclude=modules/** || true
  rm -f cov_profile/raw_lcov.info || true
  rm -rf cov_profile
  # remove any test-created modules and restore original modules dir if it existed
  rm -rf modules/test_* modules/a modules/index modules/profile || true
  rmdir modules >/dev/null 2>&1 || true
  if [ -d "${MODULES_BACKUP}" ]; then
    mv "${MODULES_BACKUP}" modules
  fi
else
  # For non-coverage runs also avoid loading real modules
  MODULES_BACKUP="modules_backup_$(date +%s%N)"
  if [ -d modules ]; then
    mv modules "${MODULES_BACKUP}"
  fi
  mkdir -p modules
  # run all core tests (loader.test.ts creates its own test modules)
  deno test --allow-net --allow-read --allow-write core/coverage.test.ts core/router.test.ts core/server.test.ts core/loader.test.ts
  rmdir modules >/dev/null 2>&1 || true
  if [ -d "${MODULES_BACKUP}" ]; then
    mv "${MODULES_BACKUP}" modules
  fi
fi
