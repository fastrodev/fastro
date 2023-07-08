import fastro from "../server/mod.ts";

const f = fastro();

f.static("/static", { folder: "static", maxAge: 90 });

await f.serve();
