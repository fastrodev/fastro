#!/bin/bash

# Port to use
PORT=8000

echo "--- Benchmarking Native Deno ---"
deno run -A native.ts &
SERVER_PID=$!
sleep 5 # Wait for server to start

./k6 run k6_bench.js
kill $SERVER_PID
sleep 5

echo ""
echo "--- Benchmarking Fastro ---"
deno run -A main.ts $PORT &
SERVER_PID=$!
sleep 5 # Wait for server to start

./k6 run k6_bench.js
kill $SERVER_PID

echo ""
echo "Benchmark complete."
