#!/bin/bash

# Port to use
PORT=3000
MD_FILE="BENCHMARK.md"

# Function to kill process on port
kill_port() {
    echo "Cleaning up port $PORT..."
    fuser -k $PORT/tcp > /dev/null 2>&1 || true
    pkill -f "deno run" > /dev/null 2>&1 || true
    sleep 2
}

# Ensure no leaked processes at start
kill_port

# Clear/Create Markdown File
echo "# 🏁 Fastro Performance Benchmark" > $MD_FILE
echo "" >> $MD_FILE
echo "Generated on: $(date)" >> $MD_FILE
echo "" >> $MD_FILE
echo "| Scenario | Framework | Requests/sec | Avg Latency | p(95) Latency | % of Native | Source |" >> $MD_FILE
echo "| :--- | :--- | :--- | :--- | :--- | :--- | :--- |" >> $MD_FILE

# Global variables to store native RPS for each scenario
declare -A NATIVE_RESULTS

# Helper to run k6 and extract metrics
run_bench() {
    SCENARIO=$1
    NAME=$2
    TARGET=$3
    METHOD=$4
    if [ -z "$METHOD" ]; then METHOD="GET"; fi

    echo "Running $NAME [$SCENARIO]..."
    ENDPOINT=$TARGET METHOD=$METHOD ./k6 run --no-color k6_bench.js > k6_output.txt 2>&1
    
    # Extract metrics
    RPS=$(grep "http_reqs" k6_output.txt | awk '{print $3}' | sed 's/\/s//')
    AVG=$(grep "http_req_duration" k6_output.txt | grep -o "avg=[^ ]*" | cut -d= -f2)
    P95=$(grep "http_req_duration" k6_output.txt | grep -o "p(95)=[^ ]*" | cut -d= -f2)
    
    PERCENT="-"
    SOURCE_LINK="-"
    if [ "$NAME" == "Native Deno" ]; then
        NATIVE_RESULTS["$SCENARIO"]=$RPS
        PERCENT="100%"
        SOURCE_LINK="[native.ts](native.ts)"
    else
        # Calculate percentage using awk
        N_RPS=${NATIVE_RESULTS["$SCENARIO"]}
        PERCENT=$(awk "BEGIN {printf \"%.2f%%\", ($RPS / $N_RPS) * 100}")
        SOURCE_LINK="[main.ts](main.ts)"
    fi

    echo "| $SCENARIO | $NAME | $RPS | $AVG | $P95 | $PERCENT | $SOURCE_LINK |" >> $MD_FILE
}

echo "--- Benchmarking Native Deno ---"
deno run -A native.ts &
SERVER_PID=$!
sleep 5 # Wait for server to start

run_bench "Root" "Native Deno" "/" "GET"
run_bench "URL Params" "Native Deno" "/user/123" "GET"
run_bench "Query Params" "Native Deno" "/query?name=fastro" "GET"
run_bench "Middleware" "Native Deno" "/middleware" "GET"
run_bench "JSON POST" "Native Deno" "/json" "POST"
kill_port

echo ""
echo "--- Benchmarking Fastro ---"
deno run -A main.ts $PORT &
SERVER_PID=$!
sleep 5 # Wait for server to start

run_bench "Root" "Fastro" "/" "GET"
run_bench "URL Params" "Fastro" "/user/123" "GET"
run_bench "Query Params" "Fastro" "/query?name=fastro" "GET"
run_bench "Middleware" "Fastro" "/middleware" "GET"
run_bench "JSON POST" "Fastro" "/json" "POST"
kill_port

rm k6_output.txt

echo "" >> $MD_FILE
echo "## Prerequisites" >> $MD_FILE
echo "To run this benchmark locally, ensure you have:" >> $MD_FILE
echo "1. [Deno](https://deno.land/) installed." >> $MD_FILE
echo "2. [k6](https://k6.io/) binary placed in the root directory as \`./k6\`." >> $MD_FILE
echo "3. Port $PORT available." >> $MD_FILE
echo "4. Execute the script: \`bash run_bench.sh\`." >> $MD_FILE

echo ""
echo "Benchmark complete. Results saved to $MD_FILE"
