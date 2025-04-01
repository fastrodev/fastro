---
title: "sync.WaitGroup vs errgroup in Go: A Complete Comparison Guide"
image: https://fastro.deno.dev/go.jpeg
description: "Learn the key differences between sync.WaitGroup and errgroup in Go. This guide covers error handling, use cases, and practical examples to help you choose the right tool for concurrent programming."
author: Admin
date: 04/01/2025
---

Let’s compare `sync.WaitGroup` with `golang.org/x/sync/errgroup` (commonly
called `errgroup`) in simple terms. They’re both tools in Go for managing
goroutines, but they have different purposes and features.

---

### `sync.WaitGroup`

- **What it does**: Waits for a group of goroutines to finish.
- **Focus**: Simple synchronization—making sure all tasks complete.
- **Error handling**: Doesn’t handle errors itself. You’d need to manage errors
  manually (e.g., with channels).
- **Use case**: When you just need to wait for tasks to finish, and you don’t
  care about errors or results in a fancy way.

#### Example Recap [from earlier](/blog/waitgroup):

```go
var wg sync.WaitGroup
wg.Add(2)
go func() { fmt.Println("Hello"); wg.Done() }()
go func() { fmt.Println("World"); wg.Done() }()
wg.Wait()
```

- Waits for 2 goroutines to finish. No error handling.

---

### `errgroup.Group`

- **What it does**: Waits for goroutines to finish _and_ collects errors from
  them.
- **Focus**: Synchronization + error management.
- **Error handling**: Automatically gathers the first error from any goroutine
  and lets you access it.
- **Use case**: When you’re running tasks that might fail, and you want to know
  if something went wrong.

#### Key Features:

1. **`eg.Go()`**: Starts a goroutine under the `errgroup`.
2. **`eg.Wait()`**: Waits for all goroutines to finish and returns the first
   error (if any).
3. No need for `Add` or `Done`—it’s simpler to use than `WaitGroup` in some
   ways.

#### Simple Example:

```go
package main

import (
    "errors"
    "fmt"
    "time"
    "golang.org/x/sync/errgroup"
)

func main() {
    var eg errgroup.Group

    // Task 1: Prints "Hello", no error
    eg.Go(func() error {
        time.Sleep(1 * time.Second)
        fmt.Println("Hello")
        return nil // No error
    })

    // Task 2: Prints "World", returns an error
    eg.Go(func() error {
        time.Sleep(2 * time.Second)
        fmt.Println("World")
        return errors.New("oops, something went wrong")
    })

    // Wait for all tasks and check for errors
    if err := eg.Wait(); err != nil {
        fmt.Println("Error:", err)
    } else {
        fmt.Println("All tasks are complete!")
    }
}
```

#### Output:

```
Hello           // After 1 second
World           // After 2 seconds
Error: oops, something went wrong
```

---

### Key Differences

| Feature             | `sync.WaitGroup`               | `errgroup.Group`               |
| ------------------- | ------------------------------ | ------------------------------ |
| **Purpose**         | Wait for tasks to finish       | Wait for tasks + handle errors |
| **Error Handling**  | None (DIY with channels, etc.) | Built-in, returns first error  |
| **Setup**           | `Add`, `Done`, `Wait`          | Just `Go` and `Wait`           |
| **Complexity**      | Simpler for basic use          | Slightly more advanced         |
| **Goroutine Limit** | Manual tracking with `Add`     | No manual counting             |

---

### When to Use Which?

- **`sync.WaitGroup`**:
  - You just need to wait for goroutines to finish.
  - Errors aren’t a big deal, or you’ll handle them separately.
  - Example: Running independent tasks like logging or printing.

- **`errgroup.Group`**:
  - You’re running tasks that might fail (e.g., fetching data, API calls).
  - You want to stop and know if _any_ task fails.
  - Example: Fetching multiple URLs where one might timeout.

#### Bonus: `errgroup` with Context

`errgroup` also supports `context.Context` for cancellation. If one goroutine
fails, you can cancel the others. `WaitGroup` doesn’t have this built-in.

---

### Quick Comparison Example

#### With `WaitGroup` (no errors):

```go
var wg sync.WaitGroup
wg.Add(1)
go func() { fmt.Println("Task"); wg.Done() }()
wg.Wait()
fmt.Println("Done")
```

#### With `errgroup` (with error):

```go
var eg errgroup.Group
eg.Go(func() error { fmt.Println("Task"); return errors.New("fail") })
if err := eg.Wait(); err != nil {
    fmt.Println("Error:", err)
}
```

---

Related post:

- [Understanding sync.WaitGroup in Go: A Simple Guide with Examples](/blog/waitgroup)
