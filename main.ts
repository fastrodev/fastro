// @ts-ignore: define global constant for KaTeX
globalThis.__VERSION__ = "0.16.11";

const { default: app } = await import("./app.ts");

app.serve({ port: parseInt(Deno.args[0]) || 8000 });
