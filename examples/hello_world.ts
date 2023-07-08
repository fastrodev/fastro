import fastro from "../server/mod.ts";

const f = new fastro();

f.get("/", () => new Response("Hello world"));

await f.serve();
