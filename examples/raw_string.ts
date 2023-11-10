import fastro from "../mod.ts";

const f = new fastro();

f.get("/", (_req: Request, _info: Deno.ServeHandlerInfo) => {
  return new Response("Hello, World!");
});

await f.serve();
