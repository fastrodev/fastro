import App from "./mod.ts";
import { autoRegisterModules, autoRegisterModulesFrom } from "./core/loader.ts";
import * as manifest from "./manifest.ts";

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

// Choose registration strategy depending on runtime:
// - On Deno Deploy (classic) prefer the statically-imported `manifest.ts`
//   and call the synchronous `autoRegisterModulesFrom` so bundlers and
//   the Deploy platform include the referenced modules.
// - Locally (or when running with permissions) prefer the async
//   `autoRegisterModules` which can dynamically import a project's manifest.
let isDenoDeployClassic = false;
try {
  // Deno Deploy typically sets `DENO_DEPLOYMENT_ID` in the environment.
  const dep = Deno.env.get?.("DENO_DEPLOYMENT_ID");
  isDenoDeployClassic = typeof dep === "string" && dep.length > 0;
} catch {
  // Accessing env may require --allow-env; if denied, assume local dev.
  isDenoDeployClassic = false;
}

if (isDenoDeployClassic) {
  autoRegisterModulesFrom(manifest as unknown as Record<string, unknown>, app);
} else {
  await autoRegisterModules(app);
}

app.serve({ port: parseInt(Deno.args[0]) || 8000 });
