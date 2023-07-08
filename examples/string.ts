import fastro from "../server/mod.ts";

const f = new fastro();

f.get("/", () => "Hello world");

await f.serve();
