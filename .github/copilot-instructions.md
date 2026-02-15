# Fastro Project Instructions

## General Guidelines
- **Stability**: Do not modify existing code that is already working as intended unless explicitly requested by the user.
- **Language**: Responses and code comments should primarily be in English.

## Architecture Pattern
- **Entry Point**: Always use `app/main.ts` as the primary entry point for the application.
- **Module Autoloading**: Use `autoRegisterModules(app)` in `main.ts` to automatically register modules located in the `modules/` directory.
- **Modules**:
    - Each module resides in its own folder under `modules/` (e.g., `modules/index/`).
    - The entry for a module is `mod.ts`.
    - `mod.ts` should define a `Router`, add routes to it, and `export default r.build()`.
    - **Manifest Generation**: Run `deno task gen-manifest` after adding or removing modules to update `manifest.ts`.
- **Global Middlewares**: Register global middlewares (like `logger`, `staticFiles`) in `app/main.ts` before calling `autoRegisterModules`.

## Coding Standards & APIs

### Routing & Handlers
- Support methods: `get`, `post`, `put`, `delete`, `patch`, `head`, `options`.
- Parameters: Use `:name` for path params, accessed via `ctx.params`.
- Query: Accessed via `ctx.query`.
- Return Types:
    - `string`: auto `text/plain`
    - `object`: auto `application/json`
    - `Response`: standard web response
    - `Promise`: awaited automatically

### Context (`ctx`)
- `ctx.state`: Use for sharing data between middlewares.
- `ctx.url`: Lazy-loaded `URL` object.
- `ctx.params`: Key-value pair of path parameters.
- `ctx.query`: Key-value pair of query parameters.

### Middleware Patterns
- Signature: `(req, ctx, next) => { ... return next(); }`
- Always return `next()` or a `Response` (to short-circuit).

### Built-in Middlewares
- **Logger**: `import { logger } from "../middlewares/logger/mod.ts"`
- **Static Files**: `import { staticFiles } from "../middlewares/static/static.ts"`
- **Body Parser**: `import { bodyParser } from "../middlewares/bodyparser/mod.ts"`
- **JWT**: `import { jwt } from "../middlewares/jwt/mod.ts"`
- **CORS**: `import { corsMiddleware } from "../middlewares/cors/mod.ts"`
- **KV**: `import { kvMiddleware } from "../middlewares/kv/mod.ts"`

## Goal
- Maintain 100% code coverage for all new features and modules.
- **Run `deno task cov` every time there is a new feature addition or change.**
- When creating tests for modules, ensure they handle the `autoRegisterModules` pattern correctly.
- Use `core/types.ts` for Router and App interfaces in module imports to avoid circular dependencies.
