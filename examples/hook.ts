import fastro, { Fastro, Info } from "../mod.ts";

const f = new fastro();

const hook = (_f: Fastro, _r: Request, _i: Info) => {
  return new Response("hello world");
};

f.hook(hook);

await f.serve();
