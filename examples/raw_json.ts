import fastro from "@app/mod.ts";

const f = new fastro();

f.get("/", () => ({ text: "Hello json" }));

await f.serve();
