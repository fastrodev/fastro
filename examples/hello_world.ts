import fastro from "../server/mod.ts";

const f = fastro();

f.get("/", () => new Response("Hello world"));

f.serve();
