# Fastro Framework

Fastro is a lightweight, modular web framework for Deno designed for efficient React-based development with automatic manifest generation and incremental builds.

## Core Components (src/)

### [builder.ts](src/builder.ts)
Handles the orchestration of client-side builds using `esbuild`.
- **`run()`**: Orchestrates the full build process: generates the manifest, scans for modules, and triggers builds for each one.
- **`getModulesWithApp()`**: Scans the `modules/` directory to identify folders containing either `App.tsx` or `spa.tsx`.
- **`createClient(modulePath)`**: Generates a temporary React hydration entry point in `.build_tmp/`.
- **`deleteClient(modulePath)`**: Cleans up temporary entry point files after the build is complete.
- **`build(modulePath, spa)`** (Internal): Configures and executes `esbuild` with `denoPlugin`, targeting modern browsers with JSX support.

### [generator.ts](src/generator.ts)
Automates the creation of the project's module manifest.
- **`generateManifest()`**: Scans the `modules/` directory for valid modules (containing `mod.ts`), filters out ignored patterns, and writes a root [manifest.ts](manifest.ts) file.
- **`toIdentifier(name)`** (Internal): Sanitizes module names into valid JavaScript identifiers for the manifest exports.

### [watcher.ts](src/watcher.ts)
Provides a development-time file system watcher for hot-rebuilding.
- **`run()`**: Initializes the watcher and performs an initial build.
- **`startWatcher()`**: Monitors changes in `modules/`, `components/`, `app/`, and other core directories. Supports dependency injection for testing.
- **`rebuild(modulesToRebuild)`**: Triggers incremental builds or manifest regeneration based on specific file changes.

### [manifest.ts](src/manifest.ts)
A re-export utility that exposes `generateManifest` from [generator.ts](src/generator.ts), facilitating cleaner imports for the watcher.

### [deps.ts](src/deps.ts)
Centralized dependency management, re-exporting core libraries like `esbuild`, `@deno/esbuild-plugin`, and `@std/path`.

---

## Testing and Quality

The project maintains high code quality with automated linting and extensive unit testing.

### Tasks
- **`deno task test`**: Runs all unit tests in the `src/` directory.
- **`deno task lint`**: Performs static analysis to ensure code style consistency.
- **`deno task cov`**: Runs tests and generates a coverage report. The current target is **>90% line coverage** for core logic.

### Test Suites (src/)
- **[builder_test.ts](src/builder_test.ts)**: Validates esbuild integration and module discovery.
- **[generator_test.ts](src/generator_test.ts)**: Ensures manifest generation logic and identifier sanitization.
- **[watcher_test.ts](src/watcher_test.ts)**: Tests rebuild orchestration and file system event handling.

---

## Workspace Entry Points

- **[build.ts](build.ts)**: Executes a full production build of all modules.
- **[watch.ts](watch.ts)**: Starts the development watcher for real-time updates.
- **[gen_manifest.ts](gen_manifest.ts)**: Manually triggers the generation of [manifest.ts](manifest.ts).
- **[spa.ts](spa.ts)**: A specialized script to build the "spa" module specifically.

