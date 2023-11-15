import markdown from "$fastro/middlewares/markdown.tsx";
import fastro from "$fastro/mod.ts";

const f = new fastro();
f.static("/static", { folder: "static", maxAge: 90 });
const m = new markdown({ folder: "static" });
f.use(m.middleware);

await f.serve();
