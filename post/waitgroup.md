---
title: "Understanding sync.WaitGroup in Go: A Simple Guide with Examples"
image: https://fastro.deno.dev/go.png
description: "Learn how to coordinate multiple goroutines in Go using sync.WaitGroup. This guide explains the concept using simple analogies and practical examples, perfect for Go beginners."
author: Admin
date: 04/01/2025
---

Let’s break down `var wg sync.WaitGroup` in Go (Golang) with simple terms and an
example.

### What is `sync.WaitGroup`?

Imagine you’re a boss who assigns tasks to a few workers. You want to wait until
_all_ the workers finish their tasks before you move on to the next step (like
closing the shop). In Go, `sync.WaitGroup` is a tool that helps you wait for
multiple tasks (goroutines) to complete.

- `var wg sync.WaitGroup` declares a variable named `wg` of type
  `sync.WaitGroup`. It’s like creating a checklist to track your workers.

### How does it work?

`sync.WaitGroup` has three main methods:

1. **`wg.Add(number)`**: Tells the WaitGroup how many tasks (goroutines) you’re
   starting. It’s like saying, “I have 3 workers starting now.”
2. **`wg.Done()`**: Called by a task when it finishes. It’s like a worker
   checking off, “I’m done!”
3. **`wg.Wait()`**: Pauses the program until all tasks are done. It’s like you
   waiting until every worker checks off.

### Simple Example

Let’s say you have two workers (goroutines) printing messages, and you want to
wait for both to finish before ending the program.

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

func main() {
    var wg sync.WaitGroup // Create the WaitGroup (checklist)

    // Add 2 tasks to the WaitGroup (2 workers)
    wg.Add(2)

    // Worker 1: Prints "Hello"
    go func() {
        time.Sleep(1 * time.Second) // Simulate some work
        fmt.Println("Hello")
        wg.Done() // Worker 1 is done
    }()

    // Worker 2: Prints "World"
    go func() {
        time.Sleep(2 * time.Second) // Simulate more work
        fmt.Println("World")
        wg.Done() // Worker 2 is done
    }()

    // Wait for all workers to finish
    wg.Wait()
    fmt.Println("All tasks are complete!")
}
```

### What Happens Here?

1. `var wg sync.WaitGroup`: Creates the WaitGroup.
2. `wg.Add(2)`: Tells it to wait for 2 tasks.
3. Two goroutines (workers) run at the same time:
   - One prints "Hello" after 1 second and calls `wg.Done()`.
   - One prints "World" after 2 seconds and calls `wg.Done()`.
4. `wg.Wait()`: The `main` function waits until both goroutines call
   `wg.Done()`, meaning the checklist is complete.
5. Once both are done, it prints "All tasks are complete!"

### Output

```
Hello           // After 1 second
World           // After 2 seconds
All tasks are complete!
```

### Why Use It?

Without `sync.WaitGroup`, the `main` function might finish before the
goroutines, and you’d miss the output. It’s like leaving the shop before your
workers are done—`sync.WaitGroup` keeps everything in sync.

---

Related post:

- [sync.WaitGroup vs errgroup in Go: A Complete Comparison Guide](/blog/errgroup)
