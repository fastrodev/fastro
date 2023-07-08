import fastro from "../server/mod.ts";

const f = fastro();

f.get("/", () => ({ text: "Hello json" }));

await f.serve();
