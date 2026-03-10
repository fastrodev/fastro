#!/bin/bash
set -euo pipefail

# Port to use
PORT=3000
MD_FILE="BENCHMARK.md"

# Function to kill process on port
kill_port() {
    fuser -k $PORT/tcp > /dev/null 2>&1 || true
    pkill -f "deno run" > /dev/null 2>&1 || true
    sleep 2
}

# Ensure no leaked processes at start
kill_port

# Ensure output directory exists
mkdir -p "$(dirname "$MD_FILE")"

# Ensure k6 is available (minimal error if missing)
if ! command -v k6 >/dev/null 2>&1; then
    echo "Error: 'k6' not found in PATH. Install k6 (e.g. 'brew install k6' or see https://k6.io/) and re-run." >&2
    exit 1
fi

# Clear/Create Markdown File
echo "# 🏁 Fastro Performance Benchmark" > $MD_FILE
echo "" >> $MD_FILE
echo "![k6 logo](https://upload.wikimedia.org/wikipedia/commons/e/ef/K6-logo.svg)" >> $MD_FILE
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

# Helper: run k6's warmup + measurement and extract metrics into variables
# Sets: _RPS_RAW, _RPS, _AVG, _P95
measure_k6() {
    local TARGET=$1
    local METHOD=${2:-GET}
    # Warmup: let V8 JIT compile hot paths before actual measurement
    ENDPOINT=$TARGET METHOD=$METHOD k6 run --no-color --vus 50 --duration 5s scripts/k6_bench.js > /dev/null 2>&1 || true
    ENDPOINT=$TARGET METHOD=$METHOD k6 run --no-color scripts/k6_bench.js > k6_output.txt 2>&1
    _RPS_RAW=$(grep "http_reqs" k6_output.txt | awk '{print $3}' | sed 's/\/s//')
    _RPS=$(printf "%.2f" "$_RPS_RAW")
    _AVG=$(grep "http_req_duration" k6_output.txt | grep -o "avg=[^ ]*" | cut -d= -f2)
    _P95=$(grep "http_req_duration" k6_output.txt | grep -o "p(95)=[^ ]*" | cut -d= -f2)
}

# Benchmark a single scenario: start native, measure, stop; start fastro, measure, stop.
# This keeps the two measurements close in time so system load is comparable.
bench_scenario() {
    local SCENARIO=$1
    local TARGET=$2
    local METHOD=${3:-GET}

    echo "  ↳ [$SCENARIO] native..."
    deno run -A native.ts > /dev/null 2>&1 &
    sleep 4
    measure_k6 "$TARGET" "$METHOD"
    NATIVE_RPS["$SCENARIO"]=$_RPS
    NATIVE_AVG["$SCENARIO"]=$_AVG
    NATIVE_P95["$SCENARIO"]=$_P95
    local N_RPS_RAW=$_RPS_RAW
    kill_port

    echo "  ↳ [$SCENARIO] fastro..."
    deno run -A main.ts $PORT > /dev/null 2>&1 &
    sleep 4
    measure_k6 "$TARGET" "$METHOD"
    local PERCENT
    PERCENT=$(awk "BEGIN {printf \"%.2f%%\", ($_RPS_RAW / $N_RPS_RAW) * 100}")
    FASTRO_RPS["$SCENARIO"]=$_RPS
    FASTRO_AVG["$SCENARIO"]=$_AVG
    FASTRO_P95["$SCENARIO"]=$_P95
    FASTRO_PERCENT["$SCENARIO"]=$PERCENT
    kill_port
}

echo "🚀 Starting Performance Benchmark..."
echo "------------------------------------"

SCENARIOS=("Root" "URL Params" "Query Params" "Middleware" "JSON POST")
bench_scenario "Root"         "/"                  "GET"
bench_scenario "URL Params"   "/user/123"          "GET"
bench_scenario "Query Params" "/query?name=fastro" "GET"
bench_scenario "Middleware"   "/middleware"        "GET"
bench_scenario "JSON POST"    "/json"              "POST"

# Write results to file
for S in "${SCENARIOS[@]}"; do
    echo "| **$S** | Native | ${NATIVE_RPS[$S]} | ${NATIVE_AVG[$S]} | ${NATIVE_P95[$S]} | 100% | [native.ts](native.ts) |" >> $MD_FILE
    echo "| | Fastro | ${FASTRO_RPS[$S]} | ${FASTRO_AVG[$S]} | ${FASTRO_P95[$S]} | ${FASTRO_PERCENT[$S]} | [main.ts](main.ts) |" >> $MD_FILE
done

rm -f k6_output.txt

echo "" >> $MD_FILE
echo "## Prerequisites" >> $MD_FILE
echo "To run this benchmark locally, ensure you have:" >> $MD_FILE
echo "1. [Deno](https://deno.land/) installed." >> $MD_FILE
echo "2. [k6](https://k6.io/) installed and available on PATH as \`k6\`." >> $MD_FILE
echo "3. Port $PORT available." >> $MD_FILE
echo "4. Execute the script: \`bash scripts/run_bench.sh\`." >> $MD_FILE

echo "" >> $MD_FILE
echo "## Methodology" >> $MD_FILE
echo "Each scenario starts its own server instance (Native, then Fastro) and measures them back-to-back, so both comparisons happen under similar system load. \`k6\` uses 100 virtual users for 15 seconds per measurement, preceded by a 5-second warmup phase (50 VUs) to allow V8 JIT compilation of hot paths. Results may vary depending on CPU load, memory usage, and other environmental factors. For best results, run on an idle machine." >> $MD_FILE
echo "" >> $MD_FILE
echo "For a deeper analysis, see [posts/benchmark](https://fastro.deno.dev/posts/benchmark)." >> $MD_FILE
echo "" >> $MD_FILE
echo "✅ Benchmark complete! Results saved to $MD_FILE"
