import markdown from "../middlewares/markdown.tsx";
import fastro from "../mod.ts";

const f = new fastro();
const m = new markdown();
f.use(m.middleware);
f.static("/static", { folder: "static", maxAge: 90 });

await f.serve();
