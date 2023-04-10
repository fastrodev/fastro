import fastro from "../server/mod.ts";

const f = fastro();

f.flash(false);

f.get("/", () => new Response("Hello world"));

await f.serve();
