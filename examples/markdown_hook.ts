import markdown from "../hooks/markdown.tsx";
import fastro from "../mod.ts";

const f = new fastro();
f.static("/static", { folder: "static", maxAge: 90 });
const m = new markdown({ folder: "static" });
f.hook(m.hook);

await f.serve();
