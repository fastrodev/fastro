import App from "./mod.ts";

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

app.serve({ port: parseInt(Deno.args[0]) || 8000 });
