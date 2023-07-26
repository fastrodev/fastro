import markdown from "../middlewares/markdown.tsx";
import fastro from "../mod.ts";

const f = new fastro();
f.static("/static", { folder: "static", maxAge: 90 });
const m = new markdown({ folder: "static" });
f.use(m.middleware);

await f.serve();
