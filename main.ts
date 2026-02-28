import app from "./app.ts";

app.serve({ port: parseInt(Deno.args[0]) || 8000 });
