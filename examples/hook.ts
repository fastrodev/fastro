import fastro, { Fastro, Info } from "../mod.ts";

const f = new fastro();

f.hook((_f: Fastro, _r: Request, _i: Info) => new Response("Hello World"));

await f.serve();
