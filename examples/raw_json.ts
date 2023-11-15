import fastro from "$fastro/mod.ts";

const f = new fastro();

f.get("/", () => ({ text: "Hello json" }));

await f.serve();
