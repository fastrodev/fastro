import fastro from "../server/mod.ts";

await fastro().get("/", () => "Hello world").serve();
