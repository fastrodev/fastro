import markdown from "../hooks/markdown.tsx";
import fastro from "../mod.ts";

const f = new fastro();
const m = new markdown();
f.hook(m.hook);

f.static("/static", { folder: "static", maxAge: 90 });

await f.serve();
