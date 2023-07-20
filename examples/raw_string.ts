import fastro from "../http/server.ts";

const f = new fastro();

f.get("/", () => "Hello, World!");

await f.serve();
