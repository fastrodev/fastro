import fastro from "../mod.ts";

const f = new fastro();

f.get("/", () => "Hello, World!");

await f.serve();
