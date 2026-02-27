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

const dep = Deno.env.get?.("DENO_DEPLOYMENT_ID");
if (dep) {
  // Static `import` declarations are not valid inside blocks.
  // Use a dynamic import so this path remains valid at runtime.
  const manifest = await import("./manifest.ts");
  await autoRegisterModules(app, {
    manifest: manifest as unknown as Record<string, unknown>,
  });
} else {
  await autoRegisterModules(app);
}

app.serve({ port: parseInt(Deno.args[0]) || 8000 });
