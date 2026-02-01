import App from "./mod.ts";

const app = new App();

app.get("/", () => {
  return new Response("Hello world!");
});

app.serve({ port: parseInt(Deno.args[0]) || 8000 });
