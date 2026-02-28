#!/usr/bin/env bash
set -euo pipefail

PORT=3000
K6=${K6:-k6}

start_server() {
  cmd=$1
  echo "Starting server: $cmd"
  bash -c "$cmd" &
  SPID=$!
  # wait a bit for server to bind
  sleep 1
}

stop_server() {
  if ps -p $SPID > /dev/null 2>&1; then
    kill $SPID || true
    wait $SPID 2>/dev/null || true
  fi
}

run_k6() {
  echo "Running k6 against http://0.0.0.0:${PORT}/"
  $K6 run --vus 50 --duration 10s --env TARGET=http://0.0.0.0:${PORT}/ scripts/root_test.js
}

trap 'stop_server' EXIT

echo "== Benchmark: WITHOUT autoRegisterModules =="
start_server "deno run -A scripts/server_no_loader.ts ${PORT}"
run_k6
stop_server

echo "== Benchmark: WITH autoRegisterModules (main.ts) =="
start_server "deno run -A main.ts ${PORT}"
run_k6
stop_server

echo "Done"
