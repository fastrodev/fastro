---
title: "Understanding Mutex in Go: Race Conditions vs Thread-Safe Code"
image: https://fastro.deno.dev/go.png
description: "Learn how to use sync.Mutex in Go with practical examples. Compare code with and without mutex to understand race conditions and thread safety in concurrent programming."
author: Admin
date: 04/01/2025
---

Let’s compare two simple Go programs: one **without a mutex** (demonstrating a
race condition) and one **with a mutex** (ensuring correct behavior). Both
examples will increment a shared counter using multiple goroutines. I’ll keep it
straightforward and explain the results.

---

### Case 1: No Mutex (Race Condition)

Here’s a program where multiple goroutines increment a shared `count` variable
without synchronization:

```go
package main

import (
    "fmt"
    "sync"
)

type Counter struct {
    count int
}

func (c *Counter) Increment() {
    c.count++ // No protection; race condition here
}

func main() {
    var wg sync.WaitGroup
    c := &Counter{count: 0}

    // Launch 1000 goroutines to increment the counter
    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            c.Increment()
        }()
    }

    wg.Wait()
    fmt.Println("Final count:", c.count)
}
```

#### What Happens?

- **Expected Output**: Since we increment 1000 times, you’d expect
  `Final count: 1000`.
- **Actual Output**: You’ll get a random number less than 1000 (e.g., 987, 992,
  etc.), and it changes each run.

#### Why?

- **Race Condition**: Multiple goroutines read and write `count` simultaneously.
  For example:
  1. Goroutine A reads `count = 5`.
  2. Goroutine B reads `count = 5`.
  3. A writes `6`.
  4. B writes `6`.
  - Result: Two increments produce `6` instead of `7`. Some increments are
    "lost."
- Without synchronization, the updates aren’t atomic, and the final value is
  unpredictable.

---

### Case 2: With Mutex (Safe Concurrency)

Now, let’s add a `sync.Mutex` to protect the `count` variable:

```go
package main

import (
    "fmt"
    "sync"
)

type Counter struct {
    mu    sync.Mutex // Mutex to protect the shared resource
    count int
}

func (c *Counter) Increment() {
    c.mu.Lock()   // Lock before modifying count
    c.count++     // Critical section: safe now
    c.mu.Unlock() // Unlock after modification
}

func main() {
    var wg sync.WaitGroup
    c := &Counter{count: 0}

    // Launch 1000 goroutines to increment the counter
    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            c.Increment()
        }()
    }

    wg.Wait()
    fmt.Println("Final count:", c.count)
}
```

#### What Happens?

- **Output**: `Final count: 1000` every time.
- **Why?**: The mutex ensures that only one goroutine can execute `c.count++` at
  a time:
  - When a goroutine calls `c.mu.Lock()`, it gains exclusive access.
  - Other goroutines wait until `c.mu.Unlock()` is called.
  - This serializes the increments, preventing any "lost updates."

---

### Key Differences

| Aspect                 | No Mutex                | With Mutex                  |
| ---------------------- | ----------------------- | --------------------------- |
| **Concurrency Safety** | Unsafe (race condition) | Safe (mutual exclusion)     |
| **Final Value**        | Random, less than 1000  | Always 1000                 |
| **Performance**        | Faster but incorrect    | Slightly slower but correct |
| **Use Case**           | Fails with shared data  | Works with shared data      |

---

### Running the Examples

You can copy each code block into a `.go` file (e.g., `no_mutex.go` and
`with_mutex.go`) and run them with:

```bash
go run no_mutex.go
go run with_mutex.go
```

- **No Mutex**: Try running it multiple times. You’ll see inconsistent results.
- **With Mutex**: The result is consistently correct.

To see the race condition explicitly, use Go’s race detector:

```bash
go run -race no_mutex.go
```

It’ll warn you about data races in the first example. The second example won’t
trigger any warnings.

---

### Simplified Explanation

- **No Mutex**: Goroutines step on each other’s toes, like people shouting over
  each other in a conversation—some updates get ignored.
- **With Mutex**: Goroutines take turns, like passing a microphone—everyone gets
  heard, and the count is accurate.

This is a basic use case showing why `sync.Mutex` is essential when multiple
goroutines modify shared data!

---

Related posts:

- [Understanding sync.WaitGroup in Go: A Simple Guide with Examples](/blog/waitgroup)
- [sync.WaitGroup vs errgroup in Go: A Complete Comparison Guide](/blog/errgroup)
