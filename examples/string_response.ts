import fastro from "../http/server.ts";

const f = new fastro();

f.get("/", () => new Response("Hello world"));

await f.serve();
