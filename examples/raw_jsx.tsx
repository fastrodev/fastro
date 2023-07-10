import fastro from "../mod.ts";

const f = new fastro();

f.get("/", () => <h1>Hello jsx</h1>);

await f.serve();
