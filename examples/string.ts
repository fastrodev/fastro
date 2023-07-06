import fastro from "../server/mod.ts";

const f = fastro();

f.get("/", () => "Hello world");
