// @ts-ignore: define global constant for KaTeX
globalThis.__VERSION__ = "0.16.11";
import app from "./app.ts";

app.serve({ port: parseInt(Deno.args[0]) || 8000 });
