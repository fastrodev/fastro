import fastro from "../server/mod.ts";

const f = fastro();

f.get("/", () => <h1>Hello jsx</h1>);

f.serve();
