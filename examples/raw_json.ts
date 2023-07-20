import fastro from "../http/server.ts";

const f = new fastro();

f.get("/", () => ({ text: "Hello json" }));

await f.serve();
