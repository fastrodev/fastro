import fastro from "../server/mod.ts";

const f = new fastro();

f.get("/", () => "Hello, World!");

await f.serve();
