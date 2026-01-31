import app from "./mod.ts";

app.get("/", () => {
  return new Response("Hello world!");
});

app.get("/string", () => "Hello world!");

app.serve({ port: parseInt(Deno.args[0]) || 8000 });
