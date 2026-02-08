#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(dirname "$0")/..
cd "$ROOT_DIR"

# Run linter first to catch issues before running tests or coverage
deno lint

# SAFE Cleanup: only remove generated test modules
# NEVER move or modify the original modules/index directory
cleanup() {
  rm -rf modules/test_* modules/a modules/profile modules_test_tmp
}

# Initial cleanup of only generated artifacts
cleanup

# Ensure cleanup on exit
trap cleanup EXIT

if [[ "${1-}" == "--coverage" ]]; then
  rm -rf cov_profile
  # Run tests with coverage and save profile
  # Enable coverage-only behavior in code under test
  # Run coverage for core and middlewares only. Modules should be tested
  # but excluded from coverage (they will be run separately below).
  FASTRO_COVERAGE=1 deno test --unstable-kv -A --coverage=cov_profile core/ middlewares/
  # Run module tests without collecting coverage so their transpiled sources
  # don't end up in the coverage profile.
  deno test --unstable-kv -A modules/
  # Remove cov_profile entries that reference test-generated modules so they
  # don't show up in the final coverage report, then remove the temp modules.
  if [[ -d cov_profile ]]; then
    grep -lR "modules_test_tmp" cov_profile/ 2>/dev/null | xargs -r rm -f || true
    # Exclude render middleware coverage entries when HMR/PWA instrumenting
    # causes non-deterministic coverage results in CI.
    grep -lR "auto_register_abs" cov_profile/ 2>/dev/null | xargs -r rm -f || true
    # Exclude any modules/ entries from coverage (modules are tested separately)
    grep -lR "/modules/" cov_profile/ 2>/dev/null | xargs -r rm -f || true
    # Exclude any temporary child scripts created during tests (tmp/)
    grep -lR "tmp/" cov_profile/ 2>/dev/null | xargs -r rm -f || true
  fi
  rm -rf modules_test_tmp
  # Produce lcov and human-readable summary
  deno coverage cov_profile --lcov > coverage.lcov
  deno coverage cov_profile
else
  deno test --unstable-kv -A core/ middlewares/ modules/index/
fi
