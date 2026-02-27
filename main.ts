import App from "./mod.ts";
import { autoRegisterModules } from "./core/loader.ts";

const app = new App();

app.get("/", () => {
  return new Response("Hello world!");
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

// Auto-register modules from this project's `manifest.ts` (if present).
// This is async because dynamic import may be used to load the manifest.
await autoRegisterModules(app);

app.serve({ port: parseInt(Deno.args[0]) || 8000 });
