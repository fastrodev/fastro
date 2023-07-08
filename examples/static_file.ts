import fastro from "../server/mod.ts";

const f = new fastro();

f.static("/static", { folder: "static", maxAge: 90 });

await f.serve();
