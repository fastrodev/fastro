import app from "./modules/app.ts";

app.serve({ port: parseInt(Deno.args[0]) || 8000 });
