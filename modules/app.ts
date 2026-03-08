import App from "../mod.ts";
import { autoRegisterModules } from "../core/loader.ts";

const app = new App();

// 10 global middlewares — each mutates ctx to simulate real-world stacks
app.use((_req, ctx, next) => {
  ctx.requestId = "req-123";
  return next();
});
app.use((_req, ctx, next) => {
  ctx.logged = true;
  return next();
});
app.use((_req, ctx, next) => {
  ctx.corsOrigin = "*";
  return next();
});
app.use((_req, ctx, next) => {
  ctx.securityHeaders = true;
  return next();
});
app.use((_req, ctx, next) => {
  ctx.rateLimit = 100;
  return next();
});
app.use((_req, ctx, next) => {
  ctx.sessionId = "sess-abc";
  return next();
});
app.use((_req, ctx, next) => {
  ctx.authUser = "admin";
  return next();
});
app.use((_req, ctx, next) => {
  ctx.compress = "gzip";
  return next();
});
app.use((_req, ctx, next) => {
  ctx.cacheControl = "no-cache";
  return next();
});
app.use((_req, ctx, next) => {
  ctx.metricsStart = Date.now();
  return next();
});

// Diagnostic route: returns all middleware-set ctx properties as JSON
app.get("/ctx-check", (_req, ctx) => {
  return Response.json({
    requestId: ctx.requestId,
    logged: ctx.logged,
    corsOrigin: ctx.corsOrigin,
    securityHeaders: ctx.securityHeaders,
    rateLimit: ctx.rateLimit,
    sessionId: ctx.sessionId,
    authUser: ctx.authUser,
    compress: ctx.compress,
    cacheControl: ctx.cacheControl,
    hasMetrics: typeof ctx.metricsStart === "number",
  });
});

app.get("/user/:id", (_req, ctx) => {
  return new Response(`User ${ctx.params.id}`);
});

app.get("/query", (_req, ctx) => {
  return new Response(`Hello ${ctx.query.name}`);
});

app.get("/middleware", (_req, ctx) => {
  ctx.user = "fastro";
  return new Response(`Hello ${ctx.user}`);
}, (_req, _ctx, next) => {
  return next();
});

app.post("/json", async (req) => {
  const body = await req.json();
  return body;
});

// Auto-register modules after application routes are defined so that
// explicitly-declared app routes take precedence over auto-registered
// module mounts (for example `index` which registers `/*`).
const dep = Deno.env.get?.("DENO_DEPLOYMENT_ID");
if (dep) {
  const manifest = await import("../manifest.ts");
  await autoRegisterModules(app, {
    manifest: manifest as unknown as Record<string, unknown>,
    requireExplicitGlobals: true,
  });
} else {
  await autoRegisterModules(app, { requireExplicitGlobals: true });
}

export default app;
