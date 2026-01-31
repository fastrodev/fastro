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
echo "# Fastro Performance Benchmark" > $MD_FILE
echo "" >> $MD_FILE
echo "Generated on: $(date)" >> $MD_FILE
echo "" >> $MD_FILE
echo "| Framework | Requests/sec | Avg Latency | p(95) Latency | % of Native |" >> $MD_FILE
echo "| :--- | :--- | :--- | :--- | :--- |" >> $MD_FILE

NATIVE_RPS=0

# Helper to run k6 and extract metrics
run_bench() {
    NAME=$1
    echo "Running $NAME..."
    ./k6 run --no-color k6_bench.js > k6_output.txt 2>&1
    
    # Extract metrics
    RPS=$(grep "http_reqs" k6_output.txt | awk '{print $3}' | sed 's/\/s//')
    AVG=$(grep "http_req_duration" k6_output.txt | grep -o "avg=[^ ]*" | cut -d= -f2)
    P95=$(grep "http_req_duration" k6_output.txt | grep -o "p(95)=[^ ]*" | cut -d= -f2)
    
    PERCENT="-"
    if [ "$NAME" == "Native Deno" ]; then
        NATIVE_RPS=$RPS
        PERCENT="100%"
    else
        # Calculate percentage using awk
        PERCENT=$(awk "BEGIN {printf \"%.2f%%\", ($RPS / $NATIVE_RPS) * 100}")
    fi

    echo "| $NAME | $RPS | $AVG | $P95 | $PERCENT |" >> $MD_FILE
    cat k6_output.txt
}

echo "--- Benchmarking Native Deno ---"
deno run -A native.ts &
SERVER_PID=$!
sleep 5 # Wait for server to start

run_bench "Native Deno"
kill_port

echo ""
echo "--- Benchmarking Fastro ---"
deno run -A main.ts $PORT &
SERVER_PID=$!
sleep 5 # Wait for server to start

run_bench "Fastro"
kill_port

rm k6_output.txt
echo ""
echo "Benchmark complete. Results saved to $MD_FILE"
