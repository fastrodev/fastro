#!/bin/bash

# Port to use
PORT=3000
MD_FILE="BENCHMARK.md"

# Function to kill process on port
kill_port() {
    echo "  ↳ Cleaning up port $PORT..."
    fuser -k $PORT/tcp > /dev/null 2>&1 || true
    pkill -f "deno run" > /dev/null 2>&1 || true
    sleep 2
}

# Ensure no leaked processes at start
kill_port

# Clear/Create Markdown File
echo "# 🏁 Fastro Performance Benchmark" > $MD_FILE
echo "" >> $MD_FILE
echo "Last update: $(date)" >> $MD_FILE
echo "" >> $MD_FILE
echo "This benchmark measures the performance of Fastro against native Deno \`Deno.serve\` across various scenarios." >> $MD_FILE
echo "" >> $MD_FILE
echo "| Scenario | Framework | Throughput (req/s) | Avg Latency | P95 Latency | % of Native | Source |" >> $MD_FILE
echo "| :--- | :--- | :--- | :--- | :--- | :--- | :--- |" >> $MD_FILE

# Global variables to store results
declare -A NATIVE_RPS NATIVE_AVG NATIVE_P95
declare -A FASTRO_RPS FASTRO_AVG FASTRO_P95 FASTRO_PERCENT

# Helper to run k6 and extract metrics
run_bench() {
    SCENARIO=$1
    NAME=$2
    TARGET=$3
    METHOD=$4
    if [ -z "$METHOD" ]; then METHOD="GET"; fi

    echo "  ↳ Measuring $SCENARIO..."
    ENDPOINT=$TARGET METHOD=$METHOD ./k6 run --no-color k6_bench.js > k6_output.txt 2>&1
    
    # Extract metrics
    RPS_RAW=$(grep "http_reqs" k6_output.txt | awk '{print $3}' | sed 's/\/s//')
    RPS=$(printf "%.2f" $RPS_RAW)
    AVG=$(grep "http_req_duration" k6_output.txt | grep -o "avg=[^ ]*" | cut -d= -f2)
    P95=$(grep "http_req_duration" k6_output.txt | grep -o "p(95)=[^ ]*" | cut -d= -f2)
    
    if [ "$NAME" == "Native" ]; then
        NATIVE_RPS["$SCENARIO"]=$RPS
        NATIVE_AVG["$SCENARIO"]=$AVG
        NATIVE_P95["$SCENARIO"]=$P95
    else
        N_RPS=${NATIVE_RPS["$SCENARIO"]}
        PERCENT=$(awk "BEGIN {printf \"%.2f%%\", ($RPS_RAW / $N_RPS) * 100}")
        FASTRO_RPS["$SCENARIO"]=$RPS
        FASTRO_AVG["$SCENARIO"]=$AVG
        FASTRO_P95["$SCENARIO"]=$P95
        FASTRO_PERCENT["$SCENARIO"]=$PERCENT
    fi
}

echo "🚀 Starting Performance Benchmark..."
echo "------------------------------------"

echo "🔹 Step 1: Benchmarking Native Deno (Baseline)"
deno run -A native.ts &
SERVER_PID=$!
sleep 5 # Wait for server to start

SCENARIOS=("Root" "URL Params" "Query Params" "Middleware" "JSON POST")
run_bench "Root" "Native" "/" "GET"
run_bench "URL Params" "Native" "/user/123" "GET"
run_bench "Query Params" "Native" "/query?name=fastro" "GET"
run_bench "Middleware" "Native" "/middleware" "GET"
run_bench "JSON POST" "Native" "/json" "POST"
kill_port

echo ""
echo "🔹 Step 2: Benchmarking Fastro (Target)"
deno run -A main.ts $PORT &
SERVER_PID=$!
sleep 5 # Wait for server to start

run_bench "Root" "Fastro" "/" "GET"
run_bench "URL Params" "Fastro" "/user/123" "GET"
run_bench "Query Params" "Fastro" "/query?name=fastro" "GET"
run_bench "Middleware" "Fastro" "/middleware" "GET"
run_bench "JSON POST" "Fastro" "/json" "POST"
kill_port

# Write results to file
for S in "${SCENARIOS[@]}"; do
    echo "| **$S** | Native | ${NATIVE_RPS[$S]} | ${NATIVE_AVG[$S]} | ${NATIVE_P95[$S]} | 100% | [native.ts](native.ts) |" >> $MD_FILE
    echo "| | Fastro | ${FASTRO_RPS[$S]} | ${FASTRO_AVG[$S]} | ${FASTRO_P95[$S]} | ${FASTRO_PERCENT[$S]} | [main.ts](main.ts) |" >> $MD_FILE
done

rm k6_output.txt

echo "" >> $MD_FILE
echo "## Prerequisites" >> $MD_FILE
echo "To run this benchmark locally, ensure you have:" >> $MD_FILE
echo "1. [Deno](https://deno.land/) installed." >> $MD_FILE
echo "2. [k6](https://k6.io/) binary placed in the root directory as \`./k6\`." >> $MD_FILE
echo "3. Port $PORT available." >> $MD_FILE
echo "4. Execute the script: \`bash run_bench.sh\`." >> $MD_FILE

echo "" >> $MD_FILE
echo "## Methodology" >> $MD_FILE
echo "Benchmark results are collected using \`k6\` with 100 virtual users for 10 seconds per scenario. Results may vary depending on CPU load, memory usage, system configuration, and other environmental factors. For more representative numbers, run the benchmark multiple times on an idle machine." >> $MD_FILE
echo "" >> $MD_FILE
echo "For a deeper analysis, see [blog/benchmark](blog/benchmark)." >> $MD_FILE
echo "" >> $MD_FILE
echo "✅ Benchmark complete! Results saved to $MD_FILE"

