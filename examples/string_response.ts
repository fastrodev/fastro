import fastro from "@app/mod.ts";

const f = new fastro();

f.get("/", () => new Response("Hello world"));

await f.serve();
